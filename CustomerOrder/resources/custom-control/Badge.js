sap.ui.define(
	["sap/ui/core/Control"],
	function(Control) {
		return Control.extend("custom-control.control.Badge", {
			metadata: {
				properties: {
					score: {
						type: "string",
						defaultValue: ""
					}
				},
				aggregation: {}
			},
			renderer: function(oRm, oControl) {
				oRm.write("<span");
				oRm.writeAttribute("data-badge-value", oControl.getScore());
				oRm.write("/>");				
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