(this.webpackJsonp=this.webpackJsonp||[]).push([["heidel-payment6"],{"+kxS":function(e,t){const{Application:n}=Shopware,i=Shopware.Classes.ApiService;class s extends i{constructor(e,t,n="heidel_payment"){super(e,t,n)}validateCredentials(e){return this.httpClient.post(`_action/${this.getApiBasePath()}/validate-credentials`,e,{headers:this.getBasicHeaders()}).then(e=>i.handleResponse(e))}registerWebhooks(e){return this.httpClient.post(`_action/${this.getApiBasePath()}/register-webhooks`,e,{headers:this.getBasicHeaders()}).then(e=>i.handleResponse(e))}clearWebhooks(e){return this.httpClient.post(`_action/${this.getApiBasePath()}/clear-webhooks`,e,{headers:this.getBasicHeaders()}).then(e=>i.handleResponse(e))}}n.addServiceProvider("HeidelPaymentConfigurationService",e=>{const t=n.getContainer("init");return new s(t.httpClient,e.loginService)})},"1iz7":function(e,t,n){},"4aeB":function(e,t){e.exports='{% block heidel_payment_settings %}\n<sw-page class="heidel-payment-settings">\n    {% block heidel_payment_settings_header %}\n    <template slot="smart-bar-header">\n        <h2>\n            {{ $tc(\'sw-settings.index.title\') }}\n            <sw-icon name="small-arrow-medium-right" small></sw-icon>\n            {{ $tc(\'heidel-payment-settings.module.title\') }}\n        </h2>\n    </template>\n    {% endblock %}\n\n    {% block heidel_payment_settings_actions %}\n    <template slot="smart-bar-actions">\n        {% block heidel_payment_settings_actions_save %}\n        <sw-button-process\n            class="sw-settings-login-registration__save-action"\n            :isLoading="isLoading"\n            :processSuccess="isSaveSuccessful"\n            :disabled="isLoading || isTesting"\n            variant="primary"\n            @click="onSave">\n            {{ $tc(\'global.default.save\') }}\n        </sw-button-process>\n        {% endblock %}\n\n        {% block heidel_payment_settings_actions_test %}\n        <sw-button-process\n            :isLoading="isTesting"\n            :processSuccess="isTestSuccessful"\n            @process-finish="onTestFinished()"\n            :disabled="isLoading"\n            @click="onValidateCredentials">\n            {{ $tc(\'heidel-payment-settings.form.testButton\') }}\n        </sw-button-process>\n        {% endblock %}\n\n        {% block heidel_payment_settings_actions_register_webhooks %}\n        <heidel-payment-register-webhook></heidel-payment-register-webhook>\n        {% endblock %}\n\n    </template>\n    {% endblock %}\n\n    {% block heidel_payment_settings_content %}\n    <template slot="content">\n        <sw-card-view>\n            <sw-system-config\n                ref="systemConfig"\n                salesChannelSwitchable\n                inherit\n                @config-changed="onConfigChange"\n                domain="HeidelPayment6.settings">\n\n                <template #card-element="{ element, config }">\n                    <div>\n                        <sw-form-field-renderer\n                            :config="{\n                                        componentName: \'sw-entity-single-select\',\n                                        label: getInlineSnippet(element.config.label),\n                                        helpText: getInlineSnippet(element.config.helpText),\n                                        entity: \'state_machine_state\',\n                                        criteria: getDeliveryStatusCriteria(),\n                                    }"\n                            v-model="config[element.name]"\n                            v-if="element.name.endsWith(\'statusForAutomaticShippingNotification\')">\n                        </sw-form-field-renderer>\n\n                        <sw-form-field-renderer\n                            v-bind="getBind(element, config)"\n                            v-model="config[element.name]"\n                            v-else>\n                        </sw-form-field-renderer>\n                    </div>\n                </template>\n            </sw-system-config>\n        </sw-card-view>\n    </template>\n    {% endblock %}\n</sw-page>\n{% endblock %}\n'},"5j/b":function(e,t){e.exports='{% block heidel_payment_detail %}\n    <sw-card class="heidel-payment-detail" :title="$tc(\'heidel-payment.paymentDetails.detail.cardTitle\')">\n        {% block heidel_payment_detail_container %}\n            <sw-container columns="1fr 1fr" gap="0 20px">\n                {% block heidel_payment_detail_container_left %}\n                    <sw-container>\n                        <sw-description-list>\n                            <dt>{{ $tc(\'heidel-payment.paymentDetails.detail.amountTotal\') }}</dt>\n                            <dd>{{ paymentResource.basket.amountTotalGross | currency(paymentResource.currency) }}</dd>\n\n                            <dt>{{ $tc(\'heidel-payment.paymentDetails.detail.amountTotalVat\') }}</dt>\n                            <dd>{{ paymentResource.basket.amountTotalVat | currency(paymentResource.currency) }}</dd>\n\n                            <dt>{{ $tc(\'heidel-payment.paymentDetails.detail.currency\') }}</dt>\n                            <dd>{{ paymentResource.currency }}</dd>\n\n                            {% block heidel_payment_detail_container_left_inner %}{% endblock %}\n                        </sw-description-list>\n                    </sw-container>\n                {% endblock %}\n\n                {% block heidel_payment_detail_container_right %}\n                    <sw-container>\n                        <sw-description-list>\n                            <dt>{{ $tc(\'heidel-payment.paymentDetails.detail.shortId\') }}</dt>\n                            <dd>{{ paymentResource.shortId }}</dd>\n\n                            <dt>{{ $tc(\'heidel-payment.paymentDetails.detail.id\') }}</dt>\n                            <dd>{{ paymentResource.id }}</dd>\n\n                            <dt>{{ $tc(\'heidel-payment.paymentDetails.detail.state\') }}</dt>\n                            <dd>{{ paymentResource.state.name }}</dd>\n\n                            {% block heidel_payment_detail_container_right_inner %}{% endblock %}\n                        </sw-description-list>\n                    </sw-container>\n                {% endblock %}\n            </sw-container>\n        {% endblock %}\n\n        {% block heidel_payment_detail_ship_button %}\n            <sw-container v-if="paymentResource.isGuaranteed" columns="1fr" justify="left">\n                <sw-button-process :isLoading="isLoading" :processSuccess="isSuccessful" @click="ship">\n                    {{ $tc(\'heidel-payment.paymentDetails.actions.shipButton\') }}\n                </sw-button-process>\n            </sw-container>\n        {% endblock %}\n    </sw-card>\n{% endblock %}\n'},"6E3l":function(e,t){e.exports="{% block sw_plugin_list_grid_columns_actions_update %}\n    <template v-if=\"item.composerName === 'heidel/payment6'\">\n        <sw-context-menu-item :routerLink=\"{ name: 'heidel.payment.configuration.settings' }\">\n            {{ $tc('sw-plugin.list.config') }}\n        </sw-context-menu-item>\n    </template>\n\n    {% parent %}\n{% endblock %}\n\n{% block sw_plugin_list_grid_columns_actions_settings %}\n    <template v-if=\"item.composerName !== 'heidel/payment6'\">\n        {% parent %}\n    </template>\n{% endblock %}\n"},"6gNM":function(e,t,n){},BzwZ:function(e,t,n){var i=n("1iz7");"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);(0,n("SZ7m").default)("0d46815a",i,!0,{})},Eq9y:function(e){e.exports=JSON.parse('{"heidel-payment":{"tabTitle":"Heidelpay","paymentDetails":{"history":{"cardTitle":"Payment History","column":{"type":"Type","amount":"Amount","date":"Date"},"type":{"authorization":"Authorization","charge":"Charging","shipment":"Shipping notification","cancellation":"Refund","default":""}},"actions":{"chargeButton":"Charge","shipButton":"Shipping notice","refundButton":"Refund"},"detail":{"cardTitle":"Payment Details","amountTotal":"Amount (gross)","amountTotalVat":"Amount (net)","currency":"Currency","shortId":"Short-ID","id":"Payment-ID","state":"State"},"metadata":{"cardTitle":"Metadata","column":{"key":"Key","value":"Value"}},"basket":{"cardTitle":"Basket","column":{"quantity":"Quantity","title":"Title","amountGross":"Amount (gross)","amountNet":"Amount (net)"}},"notifications":{"genericErrorMessage":"An error has occoured!","refundSuccessTitle":"Refund","refundSuccessMessage":"The reimbursement was successfully completed.","refundErrorTitle":"Refund","chargeSuccessTitle":"Charge","chargeSuccessMessage":"The collection of the payment was carried out successfully.","chargeErrorTitle":"Charge","shipSuccessTitle":"Shipping notice","shipSuccessMessage":"The shipping notification was successfully sent.","shipErrorTitle":"Shipping notice","invoiceNotFoundMessage":"No invoice was found for this order."}}},"heidel-payment-settings":{"module":{"title":"Heidelpay","description":"Heidelpay"},"form":{"message":{"success":{"title":"Test succeeded","message":"The provided credentials are valid!"},"error":{"title":"Test failed","message":"API Credentials are invalid, please correct them and try again!"}},"testButton":"Test API credentials","webhookButton":"Register webhooks"},"modal":{"close":"Close","webhook":{"title":"Webhooks","submit":{"register":"Register webhooks","clear":"Clear webhooks"}}},"webhook":{"messagePrefix":"Domain: ","register":{"done":"Webhook registered | Webhooks registered","error":{"title":"Something went wrong","message":"Webhook could not be registered | Webhooks could not be registered"}},"clear":{"done":"Webhook cleared | Webhooks cleared","error":{"title":"Something went wrong","message":"Webhook could not be cleared | Webhooks could not be cleared"}},"missing":{"fields":"Some mandatory fields are missing","context":"The context could not be refreshed","selection":"No domain was selected"},"notFound":{"salesChannelDomain":"The selected domain could not be found"}}}}')},EsnK:function(e){e.exports=JSON.parse('{"heidel-payment":{"tabTitle":"Heidelpay","paymentDetails":{"history":{"cardTitle":"Zahlungsverlauf","column":{"type":"Typ","amount":"Betrag","date":"Datum"},"type":{"authorization":"Reservierung","charge":"Einzug","shipment":"Versandtmitteilung","cancellation":"Rückerstattung","default":""}},"actions":{"chargeButton":"Einziehen","shipButton":"Versandmitteilung","refundButton":"Rückerstatten"},"detail":{"cardTitle":"Zahlungsdetails","amountTotal":"Betrag (brutto)","amountTotalVat":"Betrag (netto)","currency":"Währung","shortId":"Short-ID","id":"Zahlungs-ID","state":"Status"},"metadata":{"cardTitle":"Metadaten","column":{"key":"Schlüssel","value":"Wert"}},"basket":{"cardTitle":"Warenkorb","column":{"quantity":"Anzahl","title":"Titel","amountGross":"Betrag (brutto)","amountNet":"Betrag (netto)"}},"notifications":{"genericErrorMessage":"Es ist ein Fehler aufgetreten!","refundSuccessTitle":"Rückerstatten","refundSuccessMessage":"Die Rückerstattung wurde erfolgreich durchgeführt.","refundErrorTitle":"Rückerstatten","chargeSuccessTitle":"Einziehen","chargeSuccessMessage":"Das Einziehen der Zahlung wurde erfolgreich durchgeführt.","chargeErrorTitle":"Einziehen","shipSuccessTitle":"Versandmitteilung","shipSuccessMessage":"Die Versandmitteilung wurde erfolgreich gesendet.","shipErrorTitle":"Versandmitteilung","invoiceNotFoundMessage":"Zu dieser Bestellung wurde keine Rechnung gefunden"}}},"heidel-payment-settings":{"module":{"title":"Heidelpay","description":"Heidelpay"},"form":{"message":{"success":{"title":"Test erfolgreich","message":"Die angegebenen API-Zugangsdaten sind korrekt!"},"error":{"title":"Test fehlgeschlagen","message":"Die angegebenen API-Zugangsdaten sind nicht korret! Bitte korrigieren Sie die Eingabe und versuchen Sie es erneut."}},"testButton":"API Zugangsdaten testen","webhookButton":"Webhooks registrieren testen"},"modal":{"close":"Schließen","webhook":{"title":"Webhooks","submit":{"register":"Webhooks registrieren","clear":"Webhooks entfernen"}}},"webhook":{"messagePrefix":"Domain: ","register":{"done":"Webhook registriert | Webhooks registriert","error":{"title":"Ein Fehler ist aufgetreten","message":"Der Webhook konnte nicht registriert werden | Die Webhooks konnten nicht registriert werden"}},"clear":{"done":"Webhook entfernt | Webhooks entfernt","error":{"title":"Ein Fehler ist aufgetreten","message":"Der Webhook konnte nicht entfernt werden | Die Webhooks konnten nicht entfernt werden"}},"missing":{"fields":"Nicht alle benötigten Felder sind vorhanden","context":"Der Kontext konnte nicht aktualisiert werden","selection":"Es wurden keine Domains selektiert"},"notFound":{"salesChannelDomain":"Die spezifizierte Domain wurde nicht gefunden"}}}}')},Gaz2:function(e,t){e.exports='{% block heidel_payment_basket %}\n    <sw-card class="heidel-payment-basket" :title="$tc(\'heidel-payment.paymentDetails.basket.cardTitle\')">\n        <sw-container slot="grid" type="row">\n            {% block heidel_payment_basket_container %}\n                <sw-data-grid\n                    :dataSource="data"\n                    :columns="columns"\n                    :showSelection="false"\n                    :showActions="false">\n                </sw-data-grid>\n            {% endblock %}\n        </sw-container>\n    </sw-card>\n{% endblock %}\n'},KEl0:function(e,t){e.exports='{% block heidel_payment_actions %}\n    <sw-container columns="1fr 1fr" gap="0 10px" v-on:click.native.stop>\n        {% block heidel_payment_actions_amount_field %}\n            <div class="heidel-payment-actions--input">\n                <sw-number-field\n                    v-model="transactionAmount">\n                </sw-number-field>\n            </div>\n        {% endblock %}\n\n        <div class="heidel-payment-actions--button">\n            {% block heidel_payment_actions_charge_button %}\n                <sw-button-process :isLoading="isLoading" :processSuccess="isSuccessful" v-if="isChargePossible" @click="charge">\n                    {{ $tc(\'heidel-payment.paymentDetails.actions.chargeButton\') }}\n                </sw-button-process>\n            {% endblock %}\n\n            {% block heidel_payment_actions_refund_button %}\n                <sw-button-process :isLoading="isLoading" :processSuccess="isSuccessful" v-if="isRefundPossible" @click="refund">\n                    {{ $tc(\'heidel-payment.paymentDetails.actions.refundButton\') }}\n                </sw-button-process>\n            {% endblock %}\n\n            {% block heidel_payment_actions_default_button %}\n                <sw-button :disabled="true" v-if="!isChargePossible && !isRefundPossible">\n                    {{ $tc(\'heidel-payment.paymentDetails.actions.chargeButton\') }}\n                </sw-button>\n            {% endblock %}\n\n            {% block heidel_payment_actions_button_container_inner %}{% endblock %}\n        </div>\n    </sw-container>\n{% endblock %}\n'},PMv5:function(e,t){const{Application:n}=Shopware,i=Shopware.Classes.ApiService;class s extends i{constructor(e,t,n="heidelpay"){super(e,t,n)}fetchPaymentDetails(e){const t=`_action/${this.getApiBasePath()}/transaction/${e}/details`;return this.httpClient.get(t,{headers:this.getBasicHeaders()}).then(e=>i.handleResponse(e))}chargeTransaction(e,t,n){const s=`_action/${this.getApiBasePath()}/transaction/${e}/charge/${n}`;return this.httpClient.get(s,{headers:this.getBasicHeaders()}).then(e=>i.handleResponse(e))}refundTransaction(e,t,n){const s=`_action/${this.getApiBasePath()}/transaction/${e}/refund/${t}/${n}`;return this.httpClient.get(s,{headers:this.getBasicHeaders()}).then(e=>i.handleResponse(e))}ship(e){const t=`_action/${this.getApiBasePath()}/transaction/${e}/ship`;return this.httpClient.get(t,{headers:this.getBasicHeaders()}).then(e=>i.handleResponse(e))}}n.addServiceProvider("HeidelPaymentService",e=>{const t=n.getContainer("init");return new s(t.httpClient,e.loginService)})},R5Kq:function(e,t){e.exports="{% block sw_order_detail_content_tabs_general %}\n    {% parent %}\n\n    {% block heidel_payment_payment_tab %}\n        <sw-tabs-item v-if=\"isHeidelpayPayment\"\n                      :route=\"{ name: 'heidel-payment.payment.detail', params: { id: $route.params.id } }\"\n                      :title=\"$tc('heidel-payment.tabTitle')\">\n            {{ $tc('heidel-payment.tabTitle') }}\n        </sw-tabs-item>\n    {% endblock %}\n{% endblock %}"},SAZ9:function(e,t,n){"use strict";n.r(t);var i=n("KEl0"),s=n.n(i);const{Component:a,Mixin:o}=Shopware;a.register("heidel-payment-actions",{template:s.a,inject:["HeidelPaymentService"],mixins:[o.getByName("notification")],data(){return{isLoading:!1,isSuccessful:!1,transactionAmount:this.transactionResource.amount}},props:{transactionResource:{type:Object,required:!0},paymentResource:{type:Object,required:!0}},computed:{isChargePossible:function(){return"authorization"===this.transactionResource.type},isRefundPossible:function(){return"charge"===this.transactionResource.type}},methods:{charge(){this.isLoading=!0,this.HeidelPaymentService.chargeTransaction(this.paymentResource.orderId,this.transactionResource.id,this.transactionAmount).then(()=>{this.createNotificationSuccess({title:this.$tc("heidel-payment.paymentDetails.notifications.chargeSuccessTitle"),message:this.$tc("heidel-payment.paymentDetails.notifications.chargeSuccessMessage")}),this.isSuccessful=!0,this.$emit("reload")}).catch(e=>{let t=e.response.data.message;"generic-error"===t&&(t=this.$tc("heidel-payment.paymentDetails.notifications.genericErrorMessage")),this.createNotificationError({title:this.$tc("heidel-payment.paymentDetails.notifications.chargeErrorTitle"),message:t}),this.isLoading=!1})},refund(){this.isLoading=!0,this.HeidelPaymentService.refundTransaction(this.paymentResource.orderId,this.transactionResource.id,this.transactionAmount).then(()=>{this.createNotificationSuccess({title:this.$tc("heidel-payment.paymentDetails.notifications.refundSuccessTitle"),message:this.$tc("heidel-payment.paymentDetails.notifications.refundSuccessMessage")}),this.isSuccessful=!0,this.$emit("reload")}).catch(e=>{let t=e.response.data.message;"generic-error"===t&&(t=this.$tc("heidel-payment.paymentDetails.notifications.genericErrorMessage")),this.createNotificationError({title:this.$tc("heidel-payment.paymentDetails.notifications.refundErrorTitle"),message:t}),this.isLoading=!1})}}});var r=n("5j/b"),c=n.n(r);const{Component:l,Mixin:d}=Shopware;l.register("heidel-payment-detail",{template:c.a,inject:["HeidelPaymentService"],mixins:[d.getByName("notification")],data:()=>({isLoading:!1,isSuccessful:!1}),props:{paymentResource:{type:Object,required:!0}},methods:{ship(){this.isLoading=!0,this.HeidelPaymentService.ship(this.paymentResource.orderId).then(()=>{this.createNotificationSuccess({title:this.$tc("heidel-payment.paymentDetails.notifications.shipSuccessTitle"),message:this.$tc("heidel-payment.paymentDetails.notifications.shipSuccessMessage")}),this.isSuccessful=!0,this.$emit("reload")}).catch(e=>{let t=e.response.data.message;"generic-error"===t?t=this.$tc("heidel-payment.paymentDetails.notifications.genericErrorMessage"):"invoice-missing-error"===t&&(t=this.$tc("heidel-payment.paymentDetails.notifications.invoiceNotFoundMessage")),this.createNotificationError({title:this.$tc("heidel-payment.paymentDetails.notifications.shipErrorTitle"),message:t}),this.isLoading=!1})}}});var h=n("fpPm"),m=n.n(h);const{Component:p}=Shopware;p.register("heidel-payment-history",{template:m.a,props:{paymentResource:{type:Object,required:!0}},computed:{data:function(){const e=[];return this.paymentResource.transactions.forEach(t=>{const n=this.$options.filters.currency(parseFloat(t.amount),this.paymentResource.currency),i=this.$options.filters.date(t.date,{hour:"numeric",minute:"numeric",second:"numeric"});e.push({type:this.transactionTypeRenderer(t.type),amount:n,date:i,resource:t})}),e},columns:function(){return[{property:"type",label:this.$tc("heidel-payment.paymentDetails.history.column.type"),rawData:!0},{property:"amount",label:this.$tc("heidel-payment.paymentDetails.history.column.amount"),rawData:!0},{property:"date",label:this.$tc("heidel-payment.paymentDetails.history.column.date"),rawData:!0}]}},methods:{transactionTypeRenderer:function(e){switch(e){case"authorization":return this.$tc("heidel-payment.paymentDetails.history.type.authorization");case"charge":return this.$tc("heidel-payment.paymentDetails.history.type.charge");case"shipment":return this.$tc("heidel-payment.paymentDetails.history.type.shipment");case"cancellation":return this.$tc("heidel-payment.paymentDetails.history.type.cancellation");default:return this.$tc("heidel-payment.paymentDetails.history.type.default")}},reloadPaymentDetails:function(){this.$emit("reload")}}});var u=n("nmHs"),g=n.n(u);const{Component:y}=Shopware;y.register("heidel-payment-metadata",{template:g.a,props:{paymentResource:{type:Object,required:!0}},computed:{data:function(){const e=[];return this.paymentResource.metadata.forEach(t=>{e.push({key:t.key,value:t.value})}),e},columns:function(){return[{property:"key",label:this.$tc("heidel-payment.paymentDetails.metadata.column.key"),rawData:!0},{property:"value",label:this.$tc("heidel-payment.paymentDetails.metadata.column.value"),rawData:!0}]}}});var b=n("Gaz2"),f=n.n(b);const{Component:k}=Shopware;k.register("heidel-payment-basket",{template:f.a,props:{paymentResource:{type:Object,required:!0}},computed:{data:function(){const e=[];return this.paymentResource.basket.basketItems.forEach(t=>{const n=this.$options.filters.currency(parseFloat(t.amountGross),this.paymentResource.currency),i=this.$options.filters.currency(parseFloat(t.amountNet),this.paymentResource.currency);e.push({quantity:t.quantity,title:t.title,amountGross:n,amountNet:i})}),e},columns:function(){return[{property:"quantity",label:this.$tc("heidel-payment.paymentDetails.basket.column.quantity"),rawData:!0},{property:"title",label:this.$tc("heidel-payment.paymentDetails.basket.column.title"),rawData:!0},{property:"amountGross",label:this.$tc("heidel-payment.paymentDetails.basket.column.amountGross"),rawData:!0},{property:"amountNet",label:this.$tc("heidel-payment.paymentDetails.basket.column.amountNet"),rawData:!0}]}}});var w=n("R5Kq"),_=n.n(w);const{Component:S,Context:v}=Shopware,{Criteria:D}=Shopware.Data;S.override("sw-order-detail",{template:_.a,data:()=>({isHeidelpayPayment:!1}),computed:{showTabs:()=>!0,paymentMethodStore:()=>State.getStore("payment_method")},watch:{orderId:{deep:!0,handler(){if(!this.orderId)return void(this.isHeidelpayPayment=!1);const e=this.repositoryFactory.create("order"),t=new D(1,1);t.addAssociation("transactions"),e.get(this.orderId,v.api,t).then(e=>{e.transactions.forEach(e=>{e.customFields&&e.customFields.heidelpay_is_transaction&&(this.isHeidelpayPayment=!0)})})},immediate:!0}}});var $=n("xTmB"),C=n.n($);const{Component:R,StateDeprecated:T}=Shopware;R.register("heidel-payment-tab",{template:C.a,inject:["HeidelPaymentService"],data:()=>({paymentResources:[],isLoading:!0}),created(){this.createdComponent()},watch:{$route(){this.resetDataAttributes(),this.createdComponent()}},methods:{createdComponent(){this.loadData()},orderStore:()=>T.getStore("order"),resetDataAttributes(){this.paymentResources=[],this.isLoading=!0},reloadPaymentDetails(){this.resetDataAttributes(),this.loadData()},loadData(){const e=this.$route.params.id;this.orderStore().getByIdAsync(e).then(e=>{this.order=e,this.order.getAssociation("transactions").getList({}).then(e=>{e.items.forEach(e=>{e.customFields&&e.customFields.heidelpay_is_transaction&&this.HeidelPaymentService.fetchPaymentDetails(e.id).then(e=>{this.isLoading=!1,this.paymentResources.push(e)}).catch(()=>{this.isLoading=!1})})})})}}});var P=n("EsnK"),B=n("Eq9y");const{Module:x}=Shopware;x.register("heidel-payment",{type:"plugin",name:"HeidelPayment",title:"heidel-payment.general.title",description:"heidel-payment.general.descriptionTextModule",version:"1.0.0",targetVersion:"1.0.0",snippets:{"de-DE":P,"en-GB":B},routeMiddleware(e,t){"sw.order.detail"===t.name&&t.children.push({component:"heidel-payment-tab",name:"heidel-payment.payment.detail",isChildren:!0,path:"/sw/order/heidelpayment/detail/:id"}),e(t)}});var M=n("ectR"),E=n.n(M);n("vrVC");Shopware.Component.register("heidel-payment-register-webhook",{template:E.a,mixins:[Shopware.Mixin.getByName("notification")],inject:["repositoryFactory","HeidelPaymentConfigurationService"],computed:{salesChannelDomainColumns:()=>[{property:"id",dataIndex:"id",label:"ID"},{property:"url",dataIndex:"url",label:"URL"}],salesChannelDomainRepository(){return this.repositoryFactory.create("sales_channel_domain")}},data:()=>({showWebhookModal:!1,isLoading:!1,isRegistering:!1,isRegistrationSuccessful:!1,isClearing:!1,isClearingSuccessful:!1,salesChannelDomains:{},selection:[]}),created(){this.salesChannelDomainRepository.search(new Shopware.Data.Criteria,Shopware.Context.api).then(e=>{this.salesChannelDomains=e})},methods:{openModal(){this.showWebhookModal=!0},closeModal(){this.showWebhookModal=!1},registerWebhooks(){const e=this;this.isRegistrationSuccessful=!1,this.isRegistering=!0,this.isLoading=!0,this.HeidelPaymentConfigurationService.registerWebhooks({selection:this.selection}).then(t=>{e.isRegistrationSuccessful=!0,void 0!==t.register&&e.messageGeneration(t.register)}).catch(t=>{void 0!==t.register&&e.messageGeneration(t.register),this.createNotificationError({title:this.$tc("heidel-payment-settings.webhook.register.error.title",t.length),message:this.$tc("heidel-payment-settings.webhook.register.error.message",t.length)})}).finally(()=>{e.isLoading=!1,e.isRegistering=!1})},clearWebhooks(){const e=this;this.isClearingSuccessful=!1,this.isClearing=!0,this.isLoading=!0,this.HeidelPaymentConfigurationService.clearWebhooks({selection:this.selection}).then(t=>{e.isClearingSuccessful=!0,void 0!==t.clear&&e.messageGeneration(t.clear)}).catch(t=>{void 0!==t.clear&&e.messageGeneration(t.clear),this.createNotificationError({title:this.$tc("heidel-payment-settings.webhook.clear.error.title",t.length),message:this.$tc("heidel-payment-settings.webhook.clear.error.message",t.length)})}).finally(()=>{e.isLoading=!1,e.isClearing=!1})},onRegistrationFinished(){this.isRegistrationSuccessful=!1},onClearingFinished(){this.isClearingSuccessful=!1},onSelectItem(e){this.selection=e},messageGeneration(e){const t=e.length;for(const n in e)void 0!==e[n]&&(void 0!==e[n].message?this.createNotificationSuccess({title:this.$tc(e[n].message,t),message:this.$tc("heidel-payment-settings.webhook.messagePrefix",t)+n}):this.createNotificationSuccess({title:this.$tc(e[n],t),message:this.$tc("heidel-payment-settings.webhook.messagePrefix",t)+n}))}}});var L=n("6E3l"),W=n.n(L);const{Component:A}=Shopware;A.override("sw-plugin-list",{template:W.a});var H=n("4aeB"),N=n.n(H);const{Component:F,Mixin:I}=Shopware,{Criteria:z}=Shopware.Data;F.register("heidel-payment-settings",{template:N.a,mixins:[I.getByName("notification"),I.getByName("sw-inline-snippet")],inject:["repositoryFactory","HeidelPaymentConfigurationService"],data:()=>({isLoading:!1,isTesting:!1,isTestSuccessful:!1,isSaveSuccessful:!1,config:{},showWebhookModal:!1}),metaInfo:()=>({title:"Heidelpay"}),computed:{paymentMethodRepository(){return this.repositoryFactory.create("payment_method")}},methods:{getConfigValue(e){const t=this.$refs.systemConfig.actualConfigData.null;return this.config[`HeidelPayment6.settings.${e}`]||t[`HeidelPayment6.settings.${e}`]},onValidateCredentials(){this.isTestSuccessful=!1,this.isTesting=!0;const e={publicKey:this.getConfigValue("publicKey"),privateKey:this.getConfigValue("privateKey"),salesChannel:this.$refs.systemConfig.currentSalesChannelId};this.HeidelPaymentConfigurationService.validateCredentials(e).then(()=>{this.createNotificationSuccess({title:this.$tc("heidel-payment-settings.form.message.success.title"),message:this.$tc("heidel-payment-settings.form.message.success.message")}),this.isTestSuccessful=!0,this.isTesting=!1}).catch(()=>{this.createNotificationError({title:this.$tc("heidel-payment-settings.form.message.error.title"),message:this.$tc("heidel-payment-settings.form.message.error.message")}),this.isTesting=!1})},onTestFinished(){this.isTestSuccessful=!1},onSave(){this.isLoading=!0,this.$refs.systemConfig.saveAll().then(()=>{this.createNotificationSuccess({title:this.$tc("sw-plugin-config.titleSaveSuccess"),message:this.$tc("sw-plugin-config.messageSaveSuccess")}),this.isLoading=!1}).catch(e=>{this.createNotificationError({title:this.$tc("sw-plugin-config.titleSaveError"),message:e}),this.isLoading=!1})},onConfigChange(e){this.config=e},getBind(e,t){return t!==this.config&&(this.config=t),e},getDeliveryStatusCriteria(){const e=new z(1,100);return e.addFilter(z.equals("stateMachine.technicalName","order_delivery.state")),e},openWebhookModal(){this.showWebhookModal=!0},closeWebhookModal(){this.showWebhookModal=!1}}});const{Module:V}=Shopware;V.register("heidel-payment-configuration",{type:"plugin",name:"HeidelPayment",title:"heidel-payment-settings.module.title",description:"heidel-payment-settings.module.description",version:"1.0.0",targetVersion:"1.0.0",snippets:{"de-DE":P,"en-GB":B},routes:{settings:{component:"heidel-payment-settings",path:"settings",meta:{parentPath:"sw.settings.index"}}}});n("PMv5"),n("+kxS"),n("BzwZ")},ectR:function(e,t){e.exports='{% block heidel_payment_payment_register_webhook %}\n<div class="register-webhook--container">\n    <sw-button-process\n            :isLoading="isRegistering"\n            :processSuccess="isRegistrationSuccessful"\n            @process-finish="onRegistrationFinished()"\n            :disabled="isLoading"\n            @click="openModal">\n        {{ $tc(\'heidel-payment-settings.form.webhookButton\') }}\n    </sw-button-process>\n    <sw-modal v-if="showWebhookModal" @modal-close="closeModal"\n              :title="$tc(`heidel-payment-settings.modal.webhook.title`)" class="heidel-payment-detail--webhook-modal">\n        <sw-data-grid\n                v-on:select-item="onSelectItem"\n                :dataSource="salesChannelDomains"\n                :columns="salesChannelDomainColumns"\n                :showActions="false"\n                :showSelection="true">\n        </sw-data-grid>\n\n        <template slot="modal-footer">\n            <sw-button :disabled="isLoading" @click="closeModal">\n                {{ $tc(\'heidel-payment-settings.modal.close\') }}\n            </sw-button>\n\n            <sw-button-process\n                    @click="clearWebhooks"\n                    @process-finish="onClearingFinished()"\n                    :isLoading="isLoading" :processSuccess="isClearingSuccessful" :disabled="isLoading"\n                    variant="primary">\n                {{ $tc(\'heidel-payment-settings.modal.webhook.submit.clear\') }}\n            </sw-button-process>\n\n            <sw-button-process\n                    @click="registerWebhooks"\n                    @process-finish="onRegistrationFinished()"\n                    :isLoading="isLoading" :processSuccess="isRegistrationSuccessful" :disabled="isLoading"\n                    variant="primary">\n                {{ $tc(\'heidel-payment-settings.modal.webhook.submit.register\') }}\n            </sw-button-process>\n        </template>\n    </sw-modal>\n</div>\n{% endblock %}\n'},fpPm:function(e,t){e.exports='{% block heidel_payment_history %}\n    <sw-card :title="$tc(\'heidel-payment.paymentDetails.history.cardTitle\')">\n        {% block heidel_payment_history_container %}\n            <sw-container slot="grid" type="row">\n                {% block heidel_payment_history_data_grid %}\n                    <sw-data-grid\n                        :dataSource="data"\n                        :columns="columns"\n                        :showSelection="false">\n\n                        {% block heidel_payment_history_actions %}\n                            <template slot="actions" slot-scope="{ item }">\n                                {% block heidel_payment_history_data_grid_item_actions %}\n                                    <heidel-payment-actions\n                                        :transactionResource="item.resource"\n                                        :paymentResource="paymentResource"\n                                        @reload="reloadPaymentDetails">\n                                    </heidel-payment-actions>\n                                {% endblock %}\n                            </template>\n                        {% endblock %}\n                    </sw-data-grid>\n                {% endblock %}\n            </sw-container>\n        {% endblock %}\n    </sw-card>\n{% endblock %}\n'},nmHs:function(e,t){e.exports='{% block heidel_payment_metadata %}\n    <sw-card class="heidel-payment-metadata" :title="$tc(\'heidel-payment.paymentDetails.metadata.cardTitle\')">\n        <sw-container slot="grid" type="row">\n            {% block heidel_payment_metadata_container %}\n                <sw-data-grid\n                    :dataSource="data"\n                    :columns="columns"\n                    :showSelection="false"\n                    :showActions="false">\n                </sw-data-grid>\n            {% endblock %}\n        </sw-container>\n    </sw-card>\n{% endblock %}\n'},vrVC:function(e,t,n){var i=n("6gNM");"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);(0,n("SZ7m").default)("eb0a43b4",i,!0,{})},xTmB:function(e,t){e.exports='{% block heidel_payment_payment_details %}\n    <div class="heidel-payment-detail">\n        <div v-if="!isLoading">\n            {% block heidel_payment_payment_details_content %}\n                <template v-for="paymentResource in paymentResources">\n                    {% block heidel_payment_payment_details_content_payment_detail %}\n                        <heidel-payment-detail\n                            :paymentResource="paymentResource"\n                            @reload="reloadPaymentDetails">\n                        </heidel-payment-detail>\n                    {% endblock %}\n\n                    {% block heidel_payment_payment_details_content_payment_history %}\n                        <heidel-payment-history\n                            :paymentResource="paymentResource"\n                            @reload="reloadPaymentDetails">\n                        </heidel-payment-history>\n                    {% endblock %}\n\n                    {% block heidel_payment_payment_details_content_payment_basket %}\n                        <heidel-payment-basket\n                            :paymentResource="paymentResource"\n                            @reload="reloadPaymentDetails">\n                        </heidel-payment-basket>\n                    {% endblock %}\n\n                    {% block heidel_payment_payment_details_content_payment_metadata %}\n                        <heidel-payment-metadata\n                            :paymentResource="paymentResource"\n                            @reload="reloadPaymentDetails">\n                        </heidel-payment-metadata>\n                    {% endblock %}\n\n                    {% block heidel_payment_payment_details_content_inner %}{% endblock %}\n                </template>\n            {% endblock %}\n        </div>\n\n        <sw-loader v-if="isLoading"></sw-loader>\n    </div>\n{% endblock %}\n'}},[["SAZ9","runtime","vendors-node"]]]);