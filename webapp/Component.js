sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"scm/ewm/PackingPOC/model/models",
	"scm/ewm/PackingPOC/service/Service",
	"scm/ewm/PackingPOC/modelHelper/OData"
], function (UIComponent, Device, models, Service, ODataHelper) {
	"use strict";

	return UIComponent.extend("scm.ewm.PackingPOC.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			var a = this.getModel();
			Service.init(this.getModel());
			ODataHelper.init(this.getModel());
		}
	});
});