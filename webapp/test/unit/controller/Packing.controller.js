/*global QUnit*/

sap.ui.define([
	"scm/ewm/PackingPOC/controller/Packing.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Packing Controller");

	QUnit.test("I should test the Packing controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});