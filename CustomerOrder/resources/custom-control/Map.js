sap.ui.define(
	["sap/ui/core/Control"],
	function (Control) {
		return Control.extend("custom-control.Map", {
			metadata: {
				properties: {
					maxZoom: {
						type: "int",
						defaultValue: -5
					},
					minZoom: {
						type: "int",
						defaultValue: -5
					},
					imageOverlay: {
						type: "string"
					}
				},
				aggregation: {
					stands: {
						type: "custom-control.Stand",
						multiple: true
					}
				},
				defaultAggregation: "stands"
			},
			init: function () {
				var cssPath = jQuery.sap.getModulePath("com.emirates.neo.appResources");
				jQuery.sap.includeStyleSheet(`${cssPath}/asset/css/leaflet.css`);
			},
			renderer: function (oRm, oControl) {
				oRm.write("<div");
				// oRm.writeControlData(oControl);
				
				oRm.writeAttribute("id", "hub-map");
				oRm.write(">");
				oRm.write("</div>");
			},
			onAfterRendering: function (args) {
				// if I need to do any post render actions, it will happen here
				if (sap.ui.core.Control.prototype.onAfterRendering) {
					sap.ui.core.Control.prototype.onAfterRendering.apply(this, args); //run the super class's method first
				}
			}

		});
	}
);