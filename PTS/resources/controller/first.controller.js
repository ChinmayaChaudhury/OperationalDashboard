/**
 * View Controller
 * @module PTS/controller/first
 * @requires module:sap.ui.core.mvc.Controller
 * @requires module:sap.ui.model.json.JSONModel
 * @requires module:sap.m.MessageToast
 * @requires module:sap.ui.model.Filter
 * @requires module:PTS.model.formatter
 * @requires module:PTS.util.helper
 * @requires module:sap.gantt.config.Shape
 * @requires module:sap.gantt.def.SvgDefs
 * @requires module:sap.gantt.def.pattern.SlashPattern
 * @requires module:sap.gantt.def.pattern.BackSlashPattern
 * @requires module:sap.gantt.config.TimeAxis
 * @requires module:sap.gantt.config.TimeHorizon
 * @see PTS.controller.first
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"PTS/model/formatter",
	"PTS/util/helper",
	"sap/gantt/config/Shape",
	"sap/gantt/def/SvgDefs",
	"sap/gantt/def/pattern/SlashPattern",
	"sap/gantt/def/pattern/BackSlashPattern",
	"sap/gantt/config/TimeAxis",
	"sap/gantt/config/TimeHorizon"
], function (Controller, JSONModel, MessageToast, Filter, formatter, helper, Shape, SvgDefs, SlashPattern, BackSlashPattern, TimeAxis, TimeHorizon) {
	"use strict";
	var original_data, oSvgDefs, resize=0;
	/**
	 * @class PTS.controller.first
	 * @extends {sap.ui.core.mvc.Controller}
	 */
	return Controller.extend("PTS.controller.first",
		/** @lends PTS.controller.first# */
		{
			formatter: formatter,
			/**
			 * Initialize window, SVG patterns and custom Gantt shapes
			 * @memberof PTS.controller.first#
			 * @returns {void}
			 * @description The method handles the resize event, to assure a proper layout of the UI in case the 
			 * browser window gets resized. Furthermore, custom color patterns (sap.def.pattern) for the Gantt shapes are defined. 
			 * The element sap.gantt.shape.Text gets extended twice in order to manipulate the alignment on the 
			 * y-axis of the texts. sap.gantt.shape.Group and sap.gantt.shape.Rectangle are extended as well to 
			 * match the use case. 
			 */
			onInit: function () {
				//Window properties for resize event
				$(window).bind("resizeEnd", function () {
					this.getView().rerender();
					var marginWidth = document.getElementById("section-1").getBBox().width;
					var progressWidth = document.getElementById("section-2").firstElementChild.width.animVal.value;
					document.getElementById("__xmlview0--progBar").setAttribute("style", "margin-left: " + marginWidth.toString() + "px; width: " +
						progressWidth.toString() + "px!important");
				}.bind(this));
				$(window).resize(function () {
					var newWidth = window.innerWidth - 275;
					document.getElementById("__xmlview0--progBar").setAttribute("width", newWidth);
					if (this.resizeTO) clearTimeout(this.resizeTO);
					$(this).trigger("resizeEnd");
				});

				//Load pattern definitions
				var oDefs = new JSONModel("./model/pattern-config.json");
				oDefs.attachRequestCompleted(function (oEvent) {
					var aBackSlash = oEvent.getSource().getData().BackSlashPattern;
					var aSlash = oEvent.getSource().getData().SlashPattern;
					var aPattern = [];

					for (var i = 0; i < aBackSlash.length; i++) {
						aPattern.push(new BackSlashPattern(aBackSlash[i].name, aBackSlash[i]));
					}

					for (var j = 0; j < aSlash.length; j++) {
						aPattern.push(new SlashPattern(aSlash[j].name, aSlash[j]));
					}
					oSvgDefs = new SvgDefs({
						defs: aPattern
					});
				});

				//Custom shape text to be displayed above standard line
				sap.ui.define(["sap/gantt/shape/Text"], function (Text) {
					var MyText = Text.extend("sap.test.MyText");
					MyText.prototype.getY = function (oData, oRowInfo) {
						return oRowInfo.y + 30;
					};
					return MyText;
				}, true);

				//Custom shape text to be displayed above standard line
				sap.ui.define(["sap/gantt/shape/Text"], function (Text) {
					var MyText1 = Text.extend("sap.test.MyText1");
					MyText1.prototype.getY = function (oData, oRowInfo) {
						return oRowInfo.y + 15;
					};
					return MyText1;
				}, true);

				//Custom shape group for PTS activities
				sap.ui.define(["sap/gantt/shape/Group"], function (Group) {
					var RectangleGroup = Group.extend("sap.test.RectangleGroup");
					RectangleGroup.prototype.getRLSAnchors = function (oRawData, oObjectInfo) {
						var shapes = this.getShapes();
						var rectangleShapeClass;
						var _x, _y;

						for (var i in shapes) {
							if (shapes[i] instanceof sap.gantt.shape.Rectangle) {
								rectangleShapeClass = shapes[i];
							}
						}

						_x = rectangleShapeClass.getX(oRawData);
						_y = rectangleShapeClass.getY(oRawData, oObjectInfo) + rectangleShapeClass.getHeight() / 2;
						_x = _x - 10;

						return {
							startPoint: {
								x: _x,
								y: _y,
								height: rectangleShapeClass.getHeight(oRawData)
							},
							endPoint: {
								x: _x + rectangleShapeClass.getWidth(oRawData),
								y: _y,
								height: rectangleShapeClass.getHeight(oRawData)
							}
						};
					};
					return RectangleGroup;
				}, true);

				//Custom shape text to be displayed smaller for milestones
				sap.ui.define(["sap/gantt/shape/Text"], function (Text) {
					var MyMileStoneText = Text.extend("sap.test.MyMileStoneText");
					MyMileStoneText.prototype.getY = function (oData, oRowInfo) {
						return oRowInfo.y + (oRowInfo.rowHeight / 1.8);
					};
					return MyMileStoneText;
				}, true);

				//Custom rectangle shape for PTS activities 
				sap.ui.define(["sap/gantt/shape/Rectangle"], function (Rectangle) {
					var MyRectangle = Rectangle.extend("sap.test.MyRectangle");

					MyRectangle.prototype.getRLSAnchors = function (oData, oRowInfo) {
						var _x = this.getX(oData, oRowInfo);
						var _y = this.getY(oData, oRowInfo);
						return {
							startPoint: {
								x: _x,
								y: _y + this.getHeight(oData) / 2,
								height: this.getHeight(oData)
							},
							endPoint: {
								x: _x + this.getWidth(oData, oRowInfo),
								y: _y + this.getHeight(oData) / 2,
								height: this.getHeight(oData)
							}
						};
					};
					return MyRectangle;
				}, true);
			},
			/**
			 * Navigate to Baggage or PAX app
			 * @event PTS.controller.first#showDetails
			 * @param {object} oEvent
			 * @returns {void}
			 * @description Event handler for the details icon in the activity list. Depending on the key of the selected element, 
			 * a detail window for either the PAX or the baggage app is opened. 
			 */
			showDetails: function (oEvent) {
				var sKey = oEvent.getSource().getCustomData()[0].getValue();
				var oHeaderData = this._oModel.getData().root.headerinfo;
				var sDateTime = oHeaderData.sch_offblock;
				var sDate;
				var sTime;

				if (sDateTime.charAt(4) === "-") {
					sDate = sDateTime.substring(0, 10);
					sTime = sDateTime.substring(11, 19);
				} else {
					sDate = sDateTime.substring(0, 4) + "-" + sDateTime.substring(4, 6) + "-" + sDateTime.substring(6, 8);
					sTime = sDateTime.substring(8, 10) + ":" + sDateTime.substring(10, 12) + ":" + sDateTime.substring(12, 14);
				}

				var param = {
					departureFlight: oHeaderData.flightOut_no.substring(2),
					departureFlightDate: sDate,
					departureFlightTime: sTime,
					tail: oHeaderData.tail_id
				};

				//Navigate to PAX or baggage app
			    if (/^(Passenger|PAX)/.test(sKey)) {
					//window.open(`https://paxtmonitoring-a577bbf7e.dispatcher.hana.ondemand.com/?flight=BR${param.departureFlight}&flightDate=${param.departureFlightDate}&flightTime=${param.departureFlightTime}&tail=${param.tail}`, '_blank');
					window.open(`https://sap-solution-experience-sdcplatform-prod-paxtracker.cfapps.eu10.hana.ondemand.com/index.html?flight=BR${param.departureFlight}&flightDate=${param.departureFlightDate}&flightTime=${param.departureFlightTime}&tail=${param.tail}`, '_blank');
				} else if (/^(Loading|Unloading)/.test(sKey)) {
				//	window.open(`https://baggagetracker-a577bbf7e.dispatcher.hana.ondemand.com/?flight=BR${param.departureFlight}&flightDate=${param.departureFlightDate}&flightTime=${param.departureFlightTime}&tail=${param.tail}`, '_blank');
					window.open(`https://sap-solution-experience-sdcplatform-prod-baggagetracker.cfapps.eu10.hana.ondemand.com/index.html?flight=BR${param.departureFlight}&flightDate=${param.departureFlightDate}&flightTime=${param.departureFlightTime}&tail=${param.tail}`, '_blank');
				}
			},
			/**
			 * Filter output using selected activity 
			 * @event PTS.controller.first#onSelectionChange
			 * @param {object} oEvent
			 * @returns {void}
			 * @description Filters the output of the Gantt chart depending on the selected activity
			 */
			onSelectionChange: function (oEvent) {
				var aFilters = [],
					sQuery = oEvent.getSource().getSelectedItem().getText(),
					oGanttChartContainer = this.getView().byId("GanttChartContainer"),
					oGanttChartWithTable = oGanttChartContainer.getGanttCharts()[0],
					binding = oGanttChartWithTable.getBinding("rows");

				//Create filter for selected activity
				if ((sQuery && sQuery.length > 0) && (sQuery !== "All Activities")) {
					var filter = new Filter("name", sap.ui.model.FilterOperator.EQ, sQuery);
					aFilters.push(filter);
				}

				binding.filter(aFilters);
			},
			/**
			 * Expand selected activity 
			 * @event PTS.controller.first#onSelectChart
			 * @param {object} oEvent
			 * @returns {void}
			 * @description Expand the selected activity on the Gantt chart
			 */
			onSelectChart: function (oEvent) {
				//Expand activitty shape if possible
				if (!(oEvent.mParameters.objectInfo.data.uptriangle == undefined) || !(oEvent.mParameters.objectInfo.data.uptriangle == null)) {
					$("#__table0-rows-row" + oEvent.mParameters.leadingRowInfo.rowIndex + "-treeicon").click();
				}
			},
			/**
			 * Expand activity list
			 * @event PTS.controller.first#onExpandTable
			 * @returns {void}
			 * @description Expand all nodes within the activity list
			 */
			onExpandTable: function () {
				this.byId("ganttView").expandToLevel(1);
			},
			/**
			 * Collapse activity list
			 * @event PTS.controller.first#onCollapseTable
			 * @returns {void}
			 * @description Collapse all nodes within the activity list
			 */
			onCollapseTable: function () {
				this.byId("ganttView").getBinding("rows").collapseToLevel(0);
			},
			/**
			 * Refresh data 
			 * @event PTS.controller.first#onActivityRefresh
			 * @param {object} oEvent
			 * @returns {void}
			 * @description Triggers a reload of the complete data set. Depending on the URL parameters, 
			 * the data set can be loaded with or without the machine learning component. Furthermore, the 
			 * currently expanded nodes are collected to be rebuilt after the data refresh. A message toast 
			 * (sap.m.MessageToast) notifies the user about a successfully executed refresh. The output is then
			 * again filtered depending on the selected PTS type (Arrival/Departure/Turnaround). 
			 */
			onActivityRefresh: function (oEvent) {
				var that = this,
					length = sap.ui.getCore().byId("__xmlview0--ganttView").getRows().length,
					expandedStatus = [],
					j = 0,
					oBundle = this.getView().getModel("i18n").getResourceBundle();

				//Collect expanded nodes from activity list and save them in temporary JSON
				for (var i = 0; i < length; i++) {
					if ($("#__table0-rows-row" + i)[0].getAttribute("aria-level") == "1") {
						var tempJSON = {
							"rowNo": "",
							"expanded": "false"
						};
						tempJSON.rowNo = j;
						if ($("#__table0-rows-row" + i)[0].getAttribute("aria-expanded") == "true") {
							tempJSON.expanded = "true";
						}
						expandedStatus.push(tempJSON);
						j++;
					}
				}

				let sParam = this._getMLToggleSelection();
				var sPath;
			//	sPath = this._getEndpoint(sParam);
			//	sPath = "./model/read_pts_output.json";
			
			//var sPath = jQuery.sap.getModulePath("PTS","/model/read_pts_output.json"); // working
	
			var sPath = "/api/pts/details";

				this._oModel = new JSONModel();
				$.ajax({
					url: sPath,
					type: "GET",
					async: true,
				}).then(function (data) {
				//	data = JSON.parse(data);
				//		that._oModel.setData(data);
// Retrieving Data from JSON
			var sPath = window.location.search.substring("1");
			var allParams = sPath.split("&");
			var flightOne = allParams[0].split("=")[1];
			var	flightOneEndTime = allParams[1].split("=")[1];
			var	flightTwo = allParams[2].split("=")[1];
			var	flightTwoStartTime = allParams[3].split("=")[1];
			var	PTS = allParams[4].split("=")[1];
				
			var allPTS = data.PTS;
			var selectedPTSArray =  allPTS.filter(pts => pts.PTS == PTS && pts.flightOne==flightOne && pts.flightOneEndTime == flightOneEndTime && pts.flightTwo == flightTwo && pts.flightTwoStartTime == flightTwoStartTime);
				var selectedPTS = selectedPTSArray[0];
data = selectedPTS.read_pts_output;

	that._oModel.setData(data);
// end
		
		

					that.getView().setModel(that._oModel, "EK");
					that.getView().getModel("EK").refresh();
					that._setTAButton(data.root.TA_BUTTON);

					var length = sap.ui.getCore().byId("__xmlview0--ganttView").getRows().length;

					//Expand nodes that were expanded before  
					for (var i = length; i >= 0; i--) {
						if (expandedStatus[i] != undefined) {
							if (expandedStatus[i].expanded == "true") {
								$("#__table0-rows-row" + i + "-treeicon").click();
							}
						}
					}

					if (oEvent) {
						MessageToast.show(oBundle.getText("msgDataSyncSuccessful"));
					}

					that.setPTSType();
				});
			},
			/**
			 * Create Gantt shapes
			 * @memberof PTS.controller.first#
			 * @param {object} oShapes
			 * @returns {object} aShapes 
			 * @description Instantiates the shapes (sap.gantt.config.Shape) for the different shape types used within the Gantt chart. 
			 * 
			 * The following standard shape types are used: 
			 * * sap.gantt.shape.Text
			 * * sap.gantt.shape.ext.Triangle
			 * * sap.gantt.shape.ext.Diamond
			 * * sap.gantt.shape.ext.rls.Relationship
			 * 
			 * In addition, the following custom shape types are defined: 
			 * * sap.test.MyRectangle
			 * * sap.test.RectangleGroup
			 * * sap.test.MyText
			 * * sap.test.MyMileStoneText 
			 * * sap.test.MyText1
			 * 
			 * All entries are loaded from a seperate JSON file. 
			 */
			_createShapes: function (oShapes) {
				var aShapes = [];
				for (var i = 0; i < oShapes.length; i++) {
					if (oShapes[i].groupAggregation) {
						var oGroup = oShapes[i].groupAggregation;
						var aGroup = [];
						for (var j = 0; j < oGroup.length; j++) {
							aGroup.push(new Shape(oGroup[j]));
						}
						oShapes[i].groupAggregation = aGroup;
					}
					aShapes.push(new Shape(oShapes[i]));
				}
				return aShapes;
			},
			/**
			 * Create header and Gantt chart 
			 * @memberof PTS.controller.first#
			 * @returns {void} 
			 * @description Reads the data set which is saved as the JSON model "EK". As soon as the data is retrieved, 
			 * the header is initialized. Therefore, several segments are created and added to the Timeline, displaying the different Planned, Scheduled 
			 * and Actual Times. Furthermore, the range of the progress bar is calculated based on estimated in- and off-block time. 
			 * At last, the shape configurations and PTS activities are loaded and added to the Gantt view. 
			 */
			onAfterRendering: function () {
				var ptsactualtime, ptsdelaytime;
				var sType = jQuery.sap.getUriParameters().get("PTS");

				
				var oViewData = new JSONModel({
					ptstype: sType && sType !== "" ? sType : "A",
					tabutton: false
				});

				this.getView().setModel(oViewData, "ViewData");

				var that = this;
				var oGanttChartContainer = this.getView().byId("GanttChartContainer");
				var oGanttChartWithTable = oGanttChartContainer.getGanttCharts()[0];
			//	var sPath = this._getEndpoint();
				
			//var sPath = jQuery.sap.getModulePath("PTS","/model/read_pts_output.json");
			
				var sPath = "/api/pts/details";

				this._oModel = new JSONModel();
				this.sType = jQuery.sap.getUriParameters().get("PTS");
				var oBundle = this.getView().getModel("i18n").getResourceBundle();

				$.ajax({
					url: sPath,
					type: "GET",
					async: false,
				}).then(function (data) {
				//	data = JSON.parse(data);
					//that._oModel.setData(data);
					
					// Retrieving Data from JSON
			var sPath = window.location.search.substring("1");
			var allParams = sPath.split("&");
			var flightOne = allParams[0].split("=")[1];
			var	flightOneEndTime = allParams[1].split("=")[1];
			var	flightTwo = allParams[2].split("=")[1];
			var	flightTwoStartTime = allParams[3].split("=")[1];
			var	PTS = allParams[4].split("=")[1];
				
			var allPTS = data.PTS;
			var selectedPTSArray =  allPTS.filter(pts => pts.PTS == PTS && pts.flightOne==flightOne && pts.flightOneEndTime == flightOneEndTime && pts.flightTwo == flightTwo && pts.flightTwoStartTime == flightTwoStartTime);
				var selectedPTS = selectedPTSArray[0];
data = selectedPTS.read_pts_output;

	that._oModel.setData(data);
// end
		
		
					original_data = data.root.children;

					that.getView().setModel(that._oModel, "EK");
					oGanttChartContainer.setContainerLayouts(that._createContainerLayouts());
					that._setTAButton(data.root.TA_BUTTON);

					//Measures for PTS header 
					const dimension = {
						width: window.innerWidth - 275,
						height: 100
					};

					const margin = {
						top: 10,
						bottom: 0,
						left: 10,
						right: 10
					};

					//Segments for PTS header
					const segments01 = [
						[{
							label: "Outstation AOBT",
							icon: "media/images/taking-off.svg",
							position: "start",
							tab1Tooltip: "Plan | Schd",
							tab1: data.root.headerinfo.outstation_ATOT_ET + " | " + data.root.headerinfo.outstation_ATOT_PT,
							tab2Tooltip: "Act",
							tab2: data.root.headerinfo.outstation_ATOT_AT
						}],
						[{
							label: "FIR Entry",
							position: "start",
							tab1Tooltip: "Plan | Schd",
							tab2Tooltip: "Act",
							tab1: data.root.headerinfo.firEntry_ET + " | " + data.root.headerinfo.firEntry_PT,
							tab2: data.root.headerinfo.firEntry_AT
						}],
						[{
							label: "Final Approach",
							position: "start",
							tab1Tooltip: "Plan | Schd",
							tab2Tooltip: "Act",
							tab1: data.root.headerinfo.finalApproach_ET + " | " + data.root.headerinfo.finalApproach_PT,
							tab2: data.root.headerinfo.finalApproach_AT
						}],
						[{
							label: "Landing",
							icon: "media/images/landed.svg",
							position: "start",
							tab1Tooltip: "Plan | Schd",
							tab2Tooltip: "Act",
							tab1: data.root.headerinfo.landing_ET + " | " + data.root.headerinfo.landing_PT,
							tab2: data.root.headerinfo.landing_AT
						}]
					];

					const segments02 = [
						[{
							label: "In-Block",
							icon: "media/images/block.svg",
							position: "start",
							tab1Tooltip: "Plan | Schd",
							tab2Tooltip: "Act",
							tab1: data.root.headerinfo.actualInBlock_ET + " | " + data.root.headerinfo.actualInBlock_PT,
							tab2: data.root.headerinfo.actualInBlock_AT
						}, {
							label: "Off-Block",
							icon: "media/images/block.svg",
							position: "end",
							tab1Tooltip: "Plan | Schd",
							tab2Tooltip: "Act",
							tab1: data.root.headerinfo.actualOffBlock_ET + " | " + data.root.headerinfo.actualOffBlock_PT,
							tab2: data.root.headerinfo.actualOffBlock_AT
						}]
					];

					const segments03 = [
						[{
							label: "Take-Off",
							icon: "media/images/taking-off.svg",
							position: "end",
							tab1Tooltip: "Plan | Schd",
							tab2Tooltip: "Act",
							tab1: data.root.headerinfo.outstation_TOBT_ET + " | " + data.root.headerinfo.outstation_TOBT_PT,
							tab2: data.root.headerinfo.outstation_TOBT_AT
						}]
					];


					const beforeLanding = new Section(dimension.width * 0.23, dimension.height, false);
					beforeLanding.AddSegments(segments01);

					const landed = new Section(dimension.width * 0.585, dimension.height, true);
					landed.AddSegments(segments02);

					const readyForDeparture = new Section(dimension.width * 0.129, dimension.height, false);
					readyForDeparture.AddSegments(segments03);

					const timeline = new Timeline(dimension, margin);
					timeline.AddSection(beforeLanding);
					timeline.AddSection(landed);
					timeline.AddSection(readyForDeparture);

					var cdate = helper.getDateFromTimeStamp(data.root.headerinfo.est_inblock);
					var ddate = helper.getDateFromTimeStamp(data.root.headerinfo.est_offblock);
					//PTS duration = estimated off-block time - estimated in-block time 
					ptsactualtime = Math.abs((ddate - cdate) / 60000);
					//Create d3 range for PTS duration 
					const diff = d3.range(ptsactualtime, 5, 5);

					var start = that._getTimestamp(data.root.headerinfo.est_inblock, true);
					var end = that._getTimestamp(data.root.headerinfo.est_offblock, false);
					oGanttChartWithTable.setTimeAxis(that._createTimeAxis(start, end));

					var flightOut_EOBT = helper.getDateFromTimeStamp(data.root.headerinfo.est_offblock);
					var flightOut_TOBT = helper.getDateFromTimeStamp(data.root.headerinfo.tobt_timestamp);
					var currentTimePro = helper.getDateFromTimeStamp(data.root.headerinfo.currentTime);
					var actualInblocktimePro = helper.getDateFromTimeStamp(data.root.headerinfo.est_inblock);
					var actualDiffValuePro = (currentTimePro - actualInblocktimePro) / 60000;

					//Progress bar value = 0% until PTS activites start
					var progressPercentValue = 0;
					var sDisplay = 0;

					//PTS occured in past -> set progress bar to 100%
					if (actualDiffValuePro > 0 && actualDiffValuePro > ptsactualtime) {
						progressPercentValue = 100;
						sDisplay = ptsactualtime;
						//PTS is still ongoig -> set progress bar to current percentage 
					} else if (actualDiffValuePro > 0) {
						progressPercentValue = (actualDiffValuePro * 100) / ptsactualtime;
						sDisplay = actualDiffValuePro;
					}

					//Format progess bar value to show [passed time] / [total time]
					var displayValuePro = sDisplay + "/" + ptsactualtime + " " + oBundle.getText("min");

					//Recalculate values if a delay in TOBT occurs (TOBT > EOBT)
					if (flightOut_TOBT > flightOut_EOBT) {
						ptsdelaytime = (flightOut_EOBT - flightOut_TOBT) / 60000;
						const delay = d3.range(ptsdelaytime, 5, 5);
						var dd = delay.pop();
						var differncevalue = dd + Math.abs(diff[diff.length - 1]);
						delay.reverse();

						for (var i = 0; i < delay.length; i++) {
							diff.push("+" + (Math.abs(delay[i]) + differncevalue));
						}

						if (diff[diff.length - 1] > Math.abs(ptsdelaytime)) {
							diff[diff.length - 1] = "+" + (Math.abs(diff[diff.length - 1]) - dd);
						}

						displayValuePro = displayValuePro + " (+" + Math.abs(ptsdelaytime) + " " + oBundle.getText("min") + oBundle.getText("delayed");
					}

					that.getView().byId("progBar").setPercentValue(progressPercentValue);
					that.getView().byId("progBar").setDisplayValue(displayValuePro);

					timeline.Render("#__xmlview0--ChartHolder");

					//Root model contains all PTS data (activities, relations etc.)
					oGanttChartWithTable.bindAggregation("rows", {
						path: "EK>/root",
						parameters: {
							arrayNames: ["children"]
						}
					});

					//Instantiate Gantt shapes 
					var oShapes = new JSONModel("./model/shapes-config.json");
					oShapes.attachRequestCompleted(function (oEvent) {
						var oShapes = oEvent.getSource().getData().ShapeConfiguration;
						var aNames = [];

						for (var i = 0; i < oShapes.length; i++) {
							aNames.push(oShapes[i].shapeDataName);
						}
						oGanttChartWithTable.setShapeDataNames(aNames);
						oGanttChartWithTable.setShapes(that._createShapes(oShapes));
						oGanttChartWithTable.setSvgDefs(oSvgDefs);

						var actvityArray = [];
						//Add seperate text element "All Activities" to list
						actvityArray.push({
							"id": "All",
							"name": oBundle.getText("allActivities")
						});
						//Add child elements 
						for (var j = 0; j < data.root.children.length; j++) {
							for (var k = 0; k < data.root.children[j].children.length; k++) {
								var actvityTemp = {
									"id": data.root.children[j].children[k].id,
									"name": data.root.children[j].children[k].name
								};
								actvityArray.push(actvityTemp);
							}
						}

						var activityArrayJSON = {
							"activitySet": actvityArray
						};

						var activityJSONModel = new JSONModel();
						activityJSONModel.setData(activityArrayJSON);
						that.getView().setModel(activityJSONModel, "activity");
						that.setPTSType();
					}, that);
				});

				//Measures for PTS header 
				var marginWidth = document.getElementById("section-1").getBBox().width;
				var progressWidth = document.getElementById("section-2").firstElementChild.width.animVal.value;
				document.getElementById("__xmlview0--progBar").setAttribute("style", "margin-left: " + marginWidth.toString() + "px; width: " +
					progressWidth.toString() + "px!important");


				//	setInterval(() => {					
				//		that.onActivityRefresh();
				//	}, 3000);
				//$(".sapMPage")[0].style.marginTop="50px";	
				if(resize ==0){
					$(".sapMPage")[0].style.marginTop="30px";
					resize=1;
					}

			},
			/**
			 * Get timestamp
			 * @memberof PTS.controller.first#
			 * @param {string} sTime
			 * @param {boolean} bDecrease
			 * @returns {string} sTimestamp 
			 * @description Converts a date string into a timestamp 
			 */
			_getTimestamp: function (sTime, bDecrease) {
				var oDate = helper.getDateFromTimeStamp(sTime);
				var oTimeFormat = new Date(oDate.setMinutes(bDecrease ? oDate.getMinutes() - 30 : oDate.getMinutes() + 30));

				var sTimestamp = (oTimeFormat.getFullYear()) + (oTimeFormat.getMonth() + 1 >= 10 ? oTimeFormat.getMonth() + 1 : "0" +
						(oTimeFormat.getMonth() + 1)) + (oTimeFormat.getDate() >= 10 ? oTimeFormat.getDate() : "0" + oTimeFormat.getDate()) +
					(oTimeFormat.getHours() >= 10 ? oTimeFormat.getHours() : "0" + oTimeFormat.getHours()) + (oTimeFormat.getMinutes() >=
						10 ? oTimeFormat.getMinutes() : "0" + oTimeFormat.getMinutes()) + (oTimeFormat.getSeconds() >= 10 ? oTimeFormat.getSeconds() : "0" +
						oTimeFormat.getSeconds());
				return sTimestamp;
			},
			/**
			 * Enable/disable Turnaround (TA) button
			 * @memberof PTS.controller.first#
			 * @param {boolean} bButton
			 * @description Sets the property "/tabutton" of the view model to true/false. The property is bound to the segmented 
			 * button (sap.m.SegmentedButton) for the PTS type selection. If the flight is defined as a Turnaround flight, the 
			 * option is enabled. Otherwise the segment is disabled.  
			 */
			_setTAButton: function (bButton) {
				this.getView().getModel("ViewData").setProperty("/tabutton", bButton === 1 ? true : false);
			},
			/**
			 * Build service URL based on arguments
			 * @memberof PTS.controller.first#
			 * @param {string} sParam
			 * @returns {string} sUrl 
			 * @description Returns the required service URL based on the given input parameters 
			 */
			_getEndpoint: function (sParam) {
				var sPath = window.location.search.substring("1");
			//	var sUrl = "/destinations/NeoHANA/Read_hub_data/read_pts_output.xsjs";
/*
				var allParams = sPath.split("&");
				flightOneVal = allParams[0].split("=")[1];
				flightOneEndTime = allParams[1].split("=")[1];
				flightTwo = allParams[2].split("=")[1];
				flightTwoStartTime = allParams[3].split("=")[1];
				PTS = allParams[4].split("=")[1];
				
				
				
var sUrl = "./model/read_pts_output.json";
return sUrl;
*/
				return sUrl + (sParam == "ML" ? "?case=ML" : "?case=DET") + (sPath.indexOf("flightOne") >= 0 ? ("&" + sPath) : "");
			},
			/**
			 * Create layout for Gantt container 
			 * @memberof PTS.controller.first#
			 * @returns {object} aContainerLayouts  
			 * @description Defines a Gantt layout (sap.gantt.config.ContainerLayout) for the displayed Gantt container
			 */
			_createContainerLayouts: function () {
				var aContainerLayouts = [
					new sap.gantt.config.ContainerLayout({
						key: "sap.test.gantt_layout",
						text: "Gantt Layout",
						toolbarSchemeKey: "GLOBAL_TOOLBAR"
					})
				];
				return aContainerLayouts;
			},
			/**
			 * Create new date object for planned time 
			 * @memberof PTS.controller.first#
			 * @param {string} sTimestamp
			 * @param {boolean} bDecrease
			 * @returns {Date} date 
			 * @description Creates a new JavaScript Date() object for the given timestamp. The method is used
			 * to adjust the start and end time of the interval shown in the Gantt chart. For the start time (bDecrease = true), 
			 * the time is reduced by 2 hours. For the end time (bDecrease = false), the time is increased by 4 hours. 
			 * The adjustments are made in order to increase the displayed time frame. 
			 */
			_getPlannedTime: function (sTimestamp, bDecrease) {
				var sTime = helper.getDateFromTimeStamp(sTimestamp);
				return new Date(sTime.setHours(bDecrease ? sTime.getHours() - 2 : sTime.getHours() + 4));
			},
			/**
			 * Create zoom levels for Gantt chart 
			 * @memberof PTS.controller.first#
			 * @param {string} startTime
			 * @param {string} endTime
			 * @returns {sap.gantt.config.TimeAxis} oTimeAxis
			 * @description Instantiates the time axis (sap.gantt.config.TimeAxis) for the Gantt chart. For the time axis, 
			 * two time horizons (sap.gantt.config.TimeHorizon) are created. The "planHorizon" sets the displayed time frame 
			 * of the Gantt chart. To increase the time frame to show some time before and after the first and last PTS activity, 
			 * the start and end time are modified accordingly. Additionaly, several zoom strategies are defined. Those specify 
			 * the granularity and intervals for different zoom levels of the Gantt chart. 
			 */
			_createTimeAxis: function (startTime, endTime) {
				var oTimeAxis = new TimeAxis({
					planHorizon: new TimeHorizon({
						startTime: this._getPlannedTime(startTime, true),
						endTime: this._getPlannedTime(endTime, false)
					}),
					initHorizon: new TimeHorizon({
						startTime: startTime,
						endTime: endTime
					}),
					zoomStrategy: {
						"15min": {
							innerInterval: {
								unit: sap.gantt.config.TimeUnit.minute,
								span: 14,
								range: 25
							},
							largeInterval: {
								unit: sap.gantt.config.TimeUnit.hour,
								span: 1,
								pattern: "HH"
							},
							smallInterval: {
								unit: sap.gantt.config.TimeUnit.minute,
								span: 15,
								pattern: "mm"
							}
						},
						"1hour": {
							innerInterval: {
								unit: sap.gantt.config.TimeUnit.hour,
								span: 1,
								range: 20
							},
							largeInterval: {
								unit: sap.gantt.config.TimeUnit.day,
								span: 1,
								pattern: "dd.M.yyyy"
							},
							smallInterval: {
								unit: sap.gantt.config.TimeUnit.hour,
								span: 1,
								pattern: "hh"
							}
						},
						"1day": {
							innerInterval: {
								unit: sap.gantt.config.TimeUnit.day,
								span: 1,
								range: 90
							},
							largeInterval: {
								unit: sap.gantt.config.TimeUnit.week,
								span: 1,
								pattern: "MMM yyyy,'Week' ww"
							},
							smallInterval: {
								unit: sap.gantt.config.TimeUnit.day,
								span: 1,
								pattern: "EEE dd"
							}
						},
						"1week": {
							innerInterval: {
								unit: sap.gantt.config.TimeUnit.week,
								span: 1,
								range: 90
							},
							largeInterval: {
								unit: sap.gantt.config.TimeUnit.month,
								span: 1,
								pattern: "MMMM yyyy"
							},
							smallInterval: {
								unit: sap.gantt.config.TimeUnit.week,
								span: 1,
								pattern: "'CW' w"
							}
						},
						"1month": {
							innerInterval: {
								unit: sap.gantt.config.TimeUnit.month,
								span: 1,
								range: 90
							},
							largeInterval: {
								unit: sap.gantt.config.TimeUnit.month,
								span: 3,
								pattern: "yyyy, QQQ"
							},
							smallInterval: {
								unit: sap.gantt.config.TimeUnit.month,
								span: 1,
								pattern: "MMM"
							}
						},
						"1quarter": {
							innerInterval: {
								unit: sap.gantt.config.TimeUnit.month,
								span: 3,
								range: 90
							},
							largeInterval: {
								unit: sap.gantt.config.TimeUnit.year,
								span: 1,
								pattern: "yyyy"
							},
							smallInterval: {
								unit: sap.gantt.config.TimeUnit.month,
								span: 3,
								pattern: "QQQ"
							}
						},
						"1year": {
							innerInterval: {
								unit: sap.gantt.config.TimeUnit.year,
								span: 1,
								range: 90
							},
							largeInterval: {
								unit: sap.gantt.config.TimeUnit.year,
								span: 10,
								pattern: "yyyy"
							},
							smallInterval: {
								unit: sap.gantt.config.TimeUnit.year,
								span: 1,
								pattern: "yyyy"
							}
						}
					},
					granularity: "15min",
					finestGranularity: "15min",
					coarsestGranularity: "1year",
					rate: 1
				});
				return oTimeAxis;
			},
			onToggelChange:function(evt){
			
				var x=5;
				var isML = evt.getSource().getState();
				if(isML == true)
				{
					this.getView().getModel('EK').getData().root.headerinfo.delayInTOBT=0; 
					if(this.getView().byId("buttonPTSType").getSelectedKey() == "A")
					{
						this.getView().getModel("ViewData").setProperty("/ptstype", "AML");
					}else if(this.getView().byId("buttonPTSType").getSelectedKey() == "D")
					{
						this.getView().getModel("ViewData").setProperty("/ptstype", "DML");
					}
					else{ // H
							this.getView().getModel("ViewData").setProperty("/ptstype", "ML");
					}
				}else // DET
				{
					this.getView().getModel('EK').getData().root.headerinfo.delayInTOBT=1; 
					if(this.getView().byId("buttonPTSType").getSelectedKey() == "A")
					{
				this.getView().getModel("ViewData").setProperty("/ptstype", "A");
					}else if(this.getView().byId("buttonPTSType").getSelectedKey() == "D"){
						this.getView().getModel("ViewData").setProperty("/ptstype", "D");
					}
					else{ // H
							this.getView().getModel("ViewData").setProperty("/ptstype", "DET");
					}
				}
		
					this.setPTSType();
					
				},
			/**
			 * Get key of selected PTS type and forward change 
			 * @event PTS.controller.first#onPTSTypeSelection
			 * @param {object} oEvent
			 * @returns {void}
			 * @description Sets the property "/ptstype" of the view model depending on the selected PTS type and 
			 * triggers the refresh of the model accordingly. 
			 */
			onPTSTypeSelection: function (oEvent) {
				/*var sType = oEvent.getParameter("item").getKey();
				this.getView().getModel("ViewData").setProperty("/ptstype", sType);
				this.setPTSType();*/
				
				var sType = oEvent.getParameter("item").getKey();
				
				var isML = this.getView().byId("detml").getState();
			
				if(isML == true)
			{
				this.getView().getModel('EK').getData().root.headerinfo.delayInTOBT=0; 
				if(sType == "A")
				{
					this.getView().getModel("ViewData").setProperty("/ptstype", "AML");
				}else if(sType == "D")
				{
					this.getView().getModel("ViewData").setProperty("/ptstype", "DML");
				}
				else{ // H
						this.getView().getModel("ViewData").setProperty("/ptstype", "ML");
				}
			}else // DET
			{
				this.getView().getModel('EK').getData().root.headerinfo.delayInTOBT=1; 
				if(sType == "A")
				{
					this.getView().getModel("ViewData").setProperty("/ptstype", "A");
				}else if(sType == "D"){
					this.getView().getModel("ViewData").setProperty("/ptstype", "D");
				}
				else{ // H
						this.getView().getModel("ViewData").setProperty("/ptstype", "DET");
				}
			}
			/*	
				if (isML == true)
				{
					this.getView().getModel("ViewData").setProperty("/ptstype", sType+"ML");
				}else{
					this.getView().getModel("ViewData").setProperty("/ptstype", sType);
				}
				*/
				this.setPTSType();
			},
			/**
			 * Refresh data with selected PTS type 
			 * @memberof PTS.controller.first#
			 * @returns {void} 
			 * @description Gets called by the event handler of the PTS selection button and filters the PTS activites 
			 * based on the selected PTS type (Arrival, Departure or Turnaround). 
			 */
			setPTSType: function () {
				var temp = original_data,
				filter,
				oModel = this.getView().getModel("EK"),
				sType = this.getView().getModel("ViewData").getProperty("/ptstype");

		if( sType.search("ML") == 0 ) {
				filter = temp.filter(function (currentValue) {
					if ((currentValue.PTS == "AML") || (currentValue.PTS == "DML")) {
						return currentValue;
					}
				});

				oModel.getData().root.children = filter;
			} else if( sType.search("DET") == 0 ) {
				filter = temp.filter(function (currentValue) {
					if ((currentValue.PTS == "A") || (currentValue.PTS == "D")) {
						return currentValue;
					}
				});

				oModel.getData().root.children = filter;
			} else{
				filter = temp.filter(function (currentValue) {
					if (currentValue.PTS == sType) {
						return currentValue;
					}
				});

				oModel.getData().root.children = filter;
			}
			//if (sType !== "H") {
		/*	if( sType.search("H") == -1 ) {
				filter = temp.filter(function (currentValue) {
					if (currentValue.PTS == sType) {
						return currentValue;
					}
				});

				oModel.getData().root.children = filter;
			} else {
				oModel.getData().root.children = original_data;
			}
*/
			oModel.refresh(true);
			/*var temp = original_data,
				filter,
				oModel = this.getView().getModel("EK"),
				sType = this.getView().getModel("ViewData").getProperty("/ptstype");

			if (sType !== "H") {
				filter = temp.filter(function (currentValue) {
					if (currentValue.PTS == sType) {
						return currentValue;
					}
				});

				oModel.getData().root.children = filter;
			} else {
				oModel.getData().root.children = original_data;
			}

			oModel.refresh(true);*/
			},
			/**
			 * Switch to ML data 
			 * @memberof PTS.controller.first#
			 * @returns {object} mlModel data or null 
			 * @description Gets data of the Machine Learning data set
			 */
			_getMLToggleSelection: function () {
				let mlModel = sap.ui.getCore().getModel("mlSelectionModel");
				if (mlModel) {
					return mlModel.getData();
				} else {
					return null;
				}
			},
			/**
			 * Format date string 
			 * @memberof PTS.controller.first#
			 * @param {string} sTimestamp
			 * @returns {string} sTimeFormat 
			 * @description Formats the given timestamp as [day]/[month] 
			 */
			dateFormatter: function (sTimestamp) {
				var sActualOffBlockTimeMonth = (sTimestamp.substr(4, 2)).toString();
				var sActualOffBlockTimeDay = sTimestamp.substr(6, 2);
				var sTimeFormat = sActualOffBlockTimeDay + "/" + sActualOffBlockTimeMonth;
				return sTimeFormat;
			}
		});
});