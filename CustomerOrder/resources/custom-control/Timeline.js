sap.ui.define(
	["sap/m/Carousel"],
	function(Carousel) {
		return Carousel.extend("custom-control.Timeline", {
			metadata: {
				properties: {},
				aggregations: {
					pages: {
						type: "custom-control.OrderDay",
						multiple: true
					}
				},
				events: {}
			},
			init: function() {
				// 
			},
			renderer: function(oRm, oControl) {
				oRm.write("<ul");
				oRm.writeControlData(oControl);
				oRm.addClass("timeline");
				oRm.writeClasses();
				oRm.write(">");

				for (let [key, value] of Object.entries(oControl.getPages())) {
					oRm.renderControl(value);
				};
				
				oRm.write("</ul>");
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