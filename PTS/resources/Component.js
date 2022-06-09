sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"PTS/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("PTS.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			sap.ui.core.IconPool.addIcon("ae", "ek", "icomoon", "e900");
			sap.ui.core.IconPool.addIcon("unloading", "ek", "icomoon", "e904");
			sap.ui.core.IconPool.addIcon("techservices", "ek", "icomoon", "e905");
			sap.ui.core.IconPool.addIcon("taking-off", "ek", "icomoon", "e906");
			sap.ui.core.IconPool.addIcon("security", "ek", "icomoon", "e907");
			sap.ui.core.IconPool.addIcon("readiness", "ek", "icomoon", "e908");
			sap.ui.core.IconPool.addIcon("Pushback_Truck", "ek", "icomoon", "e909");
			sap.ui.core.IconPool.addIcon("passenger_intime", "ek", "icomoon", "e90a");
			sap.ui.core.IconPool.addIcon("passenger_delay", "ek", "icomoon", "e90b");
			sap.ui.core.IconPool.addIcon("passenger", "ek", "icomoon", "e90c");
			sap.ui.core.IconPool.addIcon("loading", "ek", "icomoon", "e90d");
			sap.ui.core.IconPool.addIcon("landed", "ek", "icomoon", "e90e");
			sap.ui.core.IconPool.addIcon("fueling", "ek", "icomoon", "e");
			sap.ui.core.IconPool.addIcon("flight-consignment", "ek", "icomoon", "e910");
			sap.ui.core.IconPool.addIcon("crew", "ek", "icomoon", "e911");
			sap.ui.core.IconPool.addIcon("cleaning", "ek", "icomoon", "e912");
			sap.ui.core.IconPool.addIcon("catering", "ek", "icomoon", "e913");
			sap.ui.core.IconPool.addIcon("block", "ek", "icomoon", "e914");
			sap.ui.core.IconPool.addIcon("aircraft222", "ek", "icomoon", "e915");
			sap.ui.core.IconPool.addIcon("aircraft", "ek", "icomoon", "e916");
		}
	});
});