sap.ui.define([], function() {
	"use strict";
	return {
		setIconColor: function(sName) {
			var sColor = "grey";
			if (sName) {
			var subGreen = "green";
			var subRed = "red";
			
			
			if (sName.indexOf(subGreen) !== -1) {
				sColor = "green";
			} else if (sName.indexOf(subRed) !== -1) {
				sColor = "red";
			}
			}
			
			return sColor;
		}
	};
});