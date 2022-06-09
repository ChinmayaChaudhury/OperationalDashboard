sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/Link"
], function(Control, Link) {
	"use strict";
	return Control.extend("custom-control.FlightActivity", {
		"metadata": {
			"properties": {
				title: {
					type: "string",
					defaultValue: ""
				},
				key: {
					type: "string",
					defaultValue: ""
				},
				status: {
					type: "string",
					defaultValue: ""
				}
			},
			aggregations: {
				items: {
					type: "custom-control.InfoBox",
					multiple: true
				}
			},
			"events": {
				press : {
					parameters : {
						key : {type : "string"}
					}
				}
			}
		},
		init: function() {},
		renderer: function(oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.writeAttribute("data-key", oControl.getKey());
			oRm.write(">");
			oRm.write("<div>");
			oRm.write("<h1");
			oRm.addClass("slider-heading");
			oRm.writeClasses();
			oRm.write(`>${oControl.getTitle()}</h1>`);
			oRm.write("<h2");
			oRm.addClass("slider-details");
			oRm.writeClasses();
			oRm.write(">");
			
			var aKey = /^(PX|UL|LD)/.exec(oControl.getKey());
			if (aKey) {
				oRm.renderControl(new Link({
					text: "Details",
					press: function(){ oControl._showDetails(aKey[1]) }
				}).addStyleClass("detailsLink"));
			}
			
			oRm.write("</h2>");
			oRm.write("</div>");

			for (let [key, value] of Object.entries(oControl.getItems())) {
				oRm.renderControl(value);
			}

			oRm.write("</div>");
		},
		onAfterRendering: function(evt) {},
		_showDetails: function(evt){
			this.fireEvent("press");
		}
	});
});