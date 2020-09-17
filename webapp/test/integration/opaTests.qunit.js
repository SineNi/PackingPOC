/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"scm/ewm/PackingPOC/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});