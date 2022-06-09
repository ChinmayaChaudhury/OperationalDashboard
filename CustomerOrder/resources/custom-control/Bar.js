sap.ui.define(
	["sap/m/Bar"],
	function(Bar) {
		return Bar.extend("EmiratesNEO.control.Bar", {
			metadata: {
				properties: {},
				aggregation: {}
			},
			renderer: function(oRm, oControl) {
				
				// oRm.write("<header");
				// oRm.addClass("page");
				// oRm.writeClasses();
				// oRm.write(">");
				
				// Left content
				oRm.write("<section");
				oRm.addClass("left-content");
				oRm.writeClasses();
				oRm.write(">");
				
				$.each(oControl.getContentLeft(), function(key, value) {
					oRm.renderControl(value);
				});
				
				oRm.write("</section>");
				
				// Middle content
				oRm.write("<section");
				oRm.addClass("middle-content");
				oRm.writeClasses();
				oRm.write(">");
				
				$.each(oControl.getContentMiddle(), function(key, value) {
					oRm.renderControl(value);
				});
				
				oRm.write("</section>");
				
				// Right content
				oRm.write("<section");
				oRm.addClass("right-content");
				oRm.writeClasses();
				oRm.write(">");
				
				$.each(oControl.getContentRight(), function(key, value) {
					oRm.renderControl(value);
				});
				
				oRm.write("</section>");
				
				// oRm.write("</header>");
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