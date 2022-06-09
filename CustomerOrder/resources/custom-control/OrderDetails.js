sap.ui.define(
	["sap/ui/core/Control"],
	function(Control) {
		return Control.extend("custom-control.OrderDetails", {
			metadata: {
				properties: {
					title: {
						type: "string",
						defaultValue: ""
					},
					value: {
						type: "string",
						defaultValue: ""
					}
				},
				aggregations: {},
				events: {}
			},
			init: function() {
				// 
			},
			renderer: function(oRm, oControl) {
				oRm.write("<div>");
				oRm.write(`<h1>${oControl.getTitle()}</h1>`);
				oRm.write(`<h2>${oControl.getValue()}</h2>`);
				oRm.write("</div>");
			},
			onAfterRendering: function(args) {
				// if I need to do any post render actions, it will happen here
				if (sap.ui.core.Control.prototype.onAfterRendering) {
					sap.ui.core.Control.prototype.onAfterRendering.apply(this, args); //run the super class's method first
				}
			}

		});
	}
);