<?php

declare(strict_types=1);

namespace UnzerPayment6\Components\PaymentHandler;

use Psr\Log\LoggerInterface;
use Shopware\Core\Checkout\Payment\Cart\AsyncPaymentTransactionStruct;
use Shopware\Core\Checkout\Payment\Cart\PaymentHandler\AsynchronousPaymentHandlerInterface;
use Shopware\Core\Checkout\Payment\Exception\AsyncPaymentFinalizeException;
use Shopware\Core\Checkout\Payment\Exception\AsyncPaymentProcessException;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface;
use Shopware\Core\Framework\Validation\DataBag\RequestDataBag;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Throwable;
use UnzerPayment6\Components\ClientFactory\ClientFactoryInterface;
use UnzerPayment6\Components\ConfigReader\ConfigReaderInterface;
use UnzerPayment6\Components\PaymentHandler\Exception\UnzerPaymentProcessException;
use UnzerPayment6\Components\ResourceHydrator\CustomerResourceHydrator\CustomerResourceHydratorInterface;
use UnzerPayment6\Components\ResourceHydrator\ResourceHydratorInterface;
use UnzerPayment6\Components\Struct\Configuration;
use UnzerPayment6\Components\TransactionStateHandler\TransactionStateHandlerInterface;
use UnzerPayment6\Components\Validator\AutomaticShippingValidatorInterface;
use UnzerPayment6\Installer\CustomFieldInstaller;
use UnzerSDK\Exceptions\UnzerApiException;
use UnzerSDK\Resources\AbstractUnzerResource;
use UnzerSDK\Resources\Basket;
use UnzerSDK\Resources\Customer;
use UnzerSDK\Resources\Metadata;
use UnzerSDK\Resources\Payment;
use UnzerSDK\Resources\PaymentTypes\BasePaymentType;
use UnzerSDK\Resources\Recurring;
use UnzerSDK\Unzer;

abstract class AbstractUnzerPaymentHandler implements AsynchronousPaymentHandlerInterface
{
    /** @var AbstractUnzerResource|BasePaymentType */
    protected $paymentType;

    /** @var Payment */
    protected $payment;

    /** @var Recurring */
    protected $recurring;

    /** @var Unzer */
    protected $unzerClient;

    /** @var Customer */
    protected $unzerCustomer;

    /** @var Basket */
    protected $unzerBasket;

    /** @var Metadata */
    protected $unzerMetadata;

    /** @var Configuration */
    protected $pluginConfig;

    /** @var LoggerInterface */
    protected $logger;

    /** @var ResourceHydratorInterface */
    protected $basketHydrator;

    /** @var CustomerResourceHydratorInterface */
    protected $customerHydrator;

    /** @var ResourceHydratorInterface */
    protected $metadataHydrator;

    /** @var EntityRepositoryInterface */
    protected $transactionRepository;

    /** @var TransactionStateHandlerInterface */
    protected $transactionStateHandler;

    /** @var ClientFactoryInterface */
    protected $clientFactory;

    /** @var ConfigReaderInterface */
    protected $configReader;

    /** @var RequestStack */
    protected $requestStack;

    public function __construct(
        ResourceHydratorInterface $basketHydrator,
        CustomerResourceHydratorInterface $customerHydrator,
        ResourceHydratorInterface $metadataHydrator,
        EntityRepositoryInterface $transactionRepository,
        ConfigReaderInterface $configReader,
        TransactionStateHandlerInterface $transactionStateHandler,
        ClientFactoryInterface $clientFactory,
        RequestStack $requestStack,
        LoggerInterface $logger
    ) {
        $this->basketHydrator          = $basketHydrator;
        $this->customerHydrator        = $customerHydrator;
        $this->metadataHydrator        = $metadataHydrator;
        $this->transactionRepository   = $transactionRepository;
        $this->configReader            = $configReader;
        $this->transactionStateHandler = $transactionStateHandler;
        $this->clientFactory           = $clientFactory;
        $this->requestStack            = $requestStack;
        $this->logger                  = $logger;
    }

    public function pay(
        AsyncPaymentTransactionStruct $transaction,
        RequestDataBag $dataBag,
        SalesChannelContext $salesChannelContext
    ): RedirectResponse {
        $currentRequest = $this->getCurrentRequestFromStack($transaction->getOrderTransaction()->getId());

        try {
            $salesChannelId = $salesChannelContext->getSalesChannel()->getId();

            $this->pluginConfig = $this->configReader->read($salesChannelId);
            $this->unzerClient  = $this->clientFactory->createClient($salesChannelId, $currentRequest->getLocale() ?? $currentRequest->getDefaultLocale());

            $this->unzerBasket   = $this->basketHydrator->hydrateObject($salesChannelContext, $transaction);
            $this->unzerMetadata = $this->metadataHydrator->hydrateObject($salesChannelContext, $transaction);
            $this->unzerCustomer = $this->getUnzerCustomer($currentRequest->get('unzerCustomerId', ''), $transaction->getOrderTransaction()->getPaymentMethodId(), $salesChannelContext);

            $resourceId = $currentRequest->get('unzerResourceId', '');

            if (!empty($resourceId)) {
                $this->paymentType = $this->unzerClient->fetchPaymentType($resourceId);
            }

            return new RedirectResponse($transaction->getReturnUrl());
        } catch (UnzerApiException $apiException) {
            $this->logger->error(
                sprintf('Catched an API exception in %s of %s', __METHOD__, __CLASS__),
                [
                    'request'     => $this->getLoggableRequest($currentRequest),
                    'transaction' => $transaction,
                    'exception'   => $apiException,
                ]
            );

            $this->executeFailTransition(
                $transaction->getOrderTransaction()->getId(),
                $salesChannelContext->getContext()
            );

            throw new UnzerPaymentProcessException($transaction->getOrder()->getId(), $apiException);
        } catch (Throwable $exception) {
            $this->logger->error(
                sprintf('Catched a generic exception in %s of %s', __METHOD__, __CLASS__),
                [
                    'request'     => $this->getLoggableRequest($currentRequest),
                    'transaction' => $transaction,
                    'exception'   => $exception,
                ]
            );

            throw new AsyncPaymentProcessException($transaction->getOrderTransaction()->getId(), $exception->getMessage());
        }
    }

    public function finalize(
        AsyncPaymentTransactionStruct $transaction,
        Request $request,
        SalesChannelContext $salesChannelContext
    ): void {
        try {
            $this->pluginConfig = $this->configReader->read($salesChannelContext->getSalesChannel()->getId());
            $this->unzerClient  = $this->clientFactory->createClient($salesChannelContext->getSalesChannel()->getId());

            $this->payment = $this->unzerClient->fetchPaymentByOrderId($transaction->getOrderTransaction()->getId());

            $this->transactionStateHandler->transformTransactionState(
                $transaction->getOrderTransaction()->getId(),
                $this->payment,
                $salesChannelContext->getContext()
            );

            $shipmentExecuted = !in_array(
                $transaction->getOrderTransaction()->getPaymentMethodId(),
                AutomaticShippingValidatorInterface::HANDLED_PAYMENT_METHODS,
                false
            );

            $this->setCustomFields($transaction, $salesChannelContext, $shipmentExecuted);
        } catch (UnzerApiException $apiException) {
            $this->logger->error(
                sprintf('Catched an API exception in %s of %s', __METHOD__, __CLASS__),
                [
                    'transaction' => $transaction,
                    'request'     => $this->getLoggableRequest($request),
                    'exception'   => $apiException,
                ]
            );

            throw new AsyncPaymentFinalizeException($transaction->getOrderTransaction()->getId(), $apiException->getMessage());
        } catch (Throwable $exception) {
            $this->logger->error(
                sprintf('Catched a generic exception in %s of %s', __METHOD__, __CLASS__),
                [
                    'transaction' => $transaction,
                    'request'     => $this->getLoggableRequest($request),
                    'exception'   => $exception,
                ]
            );

            throw new AsyncPaymentFinalizeException($transaction->getOrderTransaction()->getId(), $exception->getMessage());
        }
    }

    protected function setCustomFields(
        AsyncPaymentTransactionStruct $transaction,
        SalesChannelContext $salesChannelContext,
        bool $shipmentExcecuted
    ): void {
        $customFields = $transaction->getOrderTransaction()->getCustomFields() ?? [];
        $customFields = array_merge($customFields, [
            CustomFieldInstaller::UNZER_PAYMENT_IS_TRANSACTION => true,
            CustomFieldInstaller::UNZER_PAYMENT_IS_SHIPPED     => $shipmentExcecuted,
        ]);

        $update = [
            'id'           => $transaction->getOrderTransaction()->getId(),
            'customFields' => $customFields,
        ];

        $this->transactionRepository->update([$update], $salesChannelContext->getContext());
    }

    protected function getCurrentRequestFromStack(string $orderTransactionId): Request
    {
        $currentRequest = $this->requestStack->getCurrentRequest();

        if ($currentRequest === null) {
            throw new AsyncPaymentProcessException($orderTransactionId, 'No request found');
        }

        return $currentRequest;
    }

    protected function executeFailTransition(string $transactionId, Context $context): void
    {
        $this->transactionStateHandler->fail(
            $transactionId,
            $context
        );
    }

    protected function getUnzerCustomer(string $unzerCustomerId, string $paymentMethodId, SalesChannelContext $salesChannelContext): AbstractUnzerResource
    {
        $customer        = $salesChannelContext->getCustomer();
        $fetchedCustomer = null;

        if (!empty($unzerCustomerId)) {
            try {
                $fetchedCustomer = $this->unzerClient->fetchCustomer($unzerCustomerId);
            } catch (Throwable $t) {
                // silentfail
            }
        }

        if ($customer && !$fetchedCustomer) {
            $customerNumber = $customer->getCustomerNumber();
            $billingAddress = $customer->getActiveBillingAddress();

            if ($billingAddress !== null && !empty($billingAddress->getCompany())) {
                $customerNumber .= '_b';
            }

            try {
                $fetchedCustomer = $this->unzerClient->fetchCustomerByExtCustomerId($customerNumber);
            } catch (Throwable $t) {
                // silentfail
            }
        }

        if ($fetchedCustomer) {
            /** @var Customer $updatedCustomer */
            $updatedCustomer = $this->customerHydrator->hydrateExistingCustomer($fetchedCustomer, $salesChannelContext);

            try {
                $updatedCustomer = $this->unzerClient->updateCustomer($updatedCustomer);
            } catch (Throwable $t) {
                // silentfail
            }

            return $updatedCustomer;
        }

        return $this->customerHydrator->hydrateObject($paymentMethodId, $salesChannelContext);
    }

    protected function getLoggableRequest(Request $request): array
    {
        $result = [
            'request-info' => sprintf('%s %s %s', $request->getMethod(), $request->getRequestUri(), $request->getScheme()) . "\r\n",
            'header'       => $request->headers->all(),
            'content'      => $request->getContent(false),
        ];
        $cookies = [];

        foreach ($request->cookies->all() as $cookieKey => $cookieValue) {
            if (is_array($cookieValue)) {
                $cookies[] = $cookieKey . '=' . json_encode($cookieValue);
            } elseif (is_scalar($cookieValue)) {
                $cookies[] = $cookieKey . '=' . $cookieValue;
            }
        }

        if (!empty($cookies)) {
            $result['cookie-header'] = 'Cookie: ' . implode('; ', $cookies) . "\r\n";
        }

        return $result;
    }
}
