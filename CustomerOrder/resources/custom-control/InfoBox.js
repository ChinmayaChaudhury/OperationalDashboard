sap.ui.define(["sap/ui/core/Control"], function(Control) {
	"use strict";
	return Control.extend("custom-control.InfoBox", {
		"metadata": {
			"properties": {
				title: {
					type: "string",
					defaultValue: "N/A"
				},
				status: {
					type: "string",
					defaultValue: ""
				},
				value: {
					type: "string",
					defaultValue: ""
				}
			},
			"events": {}
		},
		init: function() {},
		renderer: function(oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);

			if (oControl.getStatus() == "true") {
				oRm.writeAttribute("data-status", "warning");
			}

			oRm.write(">");
			oRm.write("<h1");
			oRm.write(">");
			oRm.writeEscaped(oControl.getTitle());
			oRm.write("</h1>");
			oRm.write("<h2");
			oRm.write(">");
			oRm.writeEscaped(oControl.getValue());
			oRm.write("</h2>");
			oRm.write("</div>");
		},
		onAfterRendering: function(evt) {}
	});
});