 sap.ui.define([], function() {
	"use strict";
	return {
		getDateFromTimeStamp: function(timestamp) {
		let actualOffBlockTime_year = timestamp.substr(0, 4);
		let actualOffBlockTime_month = (timestamp.substr(4, 2) - 1).toString();
		let actualOffBlockTime_day = timestamp.substr(6, 2);
		let actualOffBlockTime_hour = timestamp.substr(8, 2);
		let actualOffBlockTime_minute = timestamp.substr(10, 2);
		let actualOffBlockTime_second = timestamp.substr(12, 2);
		let timeFormat = new Date(actualOffBlockTime_year, actualOffBlockTime_month, actualOffBlockTime_day, actualOffBlockTime_hour, actualOffBlockTime_minute, actualOffBlockTime_second); // for Actual off Block time
		return timeFormat;
		}
	};
});