sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"TurnAroundView/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("TurnAroundView.Component", {

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
			
			sap.ui.core.IconPool.addIcon("aircraft", "ek", "icomoon", "e91a");
			sap.ui.core.IconPool.addIcon("airplane-flight-green", "ek", "icomoon", "e91b");
			sap.ui.core.IconPool.addIcon("airplane-flight-red", "ek", "icomoon", "e91d");
			sap.ui.core.IconPool.addIcon("airplane-flight", "ek", "icomoon", "e935");
			sap.ui.core.IconPool.addIcon("flight-consignment", "ek", "icomoon", "e91e");
			sap.ui.core.IconPool.addIcon("Maintenance-green", "ek", "icomoon", "e91f");
			sap.ui.core.IconPool.addIcon("Maintenance-grey", "ek", "icomoon", "e920");
			sap.ui.core.IconPool.addIcon("Maintenance-red", "ek", "icomoon", "e926");
			sap.ui.core.IconPool.addIcon("Maintenance", "ek", "icomoon", "e927");
			sap.ui.core.IconPool.addIcon("PTSIcon-green", "ek", "icomoon", "e928");
			sap.ui.core.IconPool.addIcon("PTSIcon-grey", "ek", "icomoon", "e929");
			sap.ui.core.IconPool.addIcon("PTSIcon-red", "ek", "icomoon", "e92a");
			sap.ui.core.IconPool.addIcon("PTSIcon", "ek", "icomoon", "e92b");
			sap.ui.core.IconPool.addIcon("TowIcon-green", "ek", "icomoon", "e92c");
			sap.ui.core.IconPool.addIcon("TowIcon-grey", "ek", "icomoon", "e92d");
			sap.ui.core.IconPool.addIcon("TowIcon-red", "ek", "icomoon", "e92e");
			sap.ui.core.IconPool.addIcon("TowIcon", "ek", "icomoon", "e92f");
			
		}
	});
});