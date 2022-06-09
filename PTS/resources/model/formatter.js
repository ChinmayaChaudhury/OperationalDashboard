sap.ui.define([], function() {
	"use strict";
	return {
		formatHeader: function(sName) {
			switch (sName) {
			case "intime": 
				return "None";
			case "delay":
				return "Error";
			default: 
				return "None";
			}
		},

		convertArrows: function(sArrow) {
			if (sArrow != null) {
				sArrow = sArrow.replace(/->/g,"➔ ");
				return sArrow;
			} else {
				return sArrow;
			}
		},
		
		setListIcon: function(sName) {
			if (sName) {
				var sIcon = "sap-icon://ek/" + sName;
				return sIcon;
			}
		},

		showDetailsLink: function(sKey, sStatus) {
			if (sStatus) {
				return /^(Passenger|PAX|Loading|Unloading)/.test(sKey);
			} else {
				return false;
			}
		}
	};
});