sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"scm/ewm/PackingPOC/modelHelper/Global",
	"scm/ewm/PackingPOC/service/Service",
	"scm/ewm/PackingPOC/utils/Util",
	"scm/ewm/PackingPOC/modelHelper/Items",
	"sap/ui/model/json/JSONModel",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/thirdparty/three",
	"sap/ui/core/ValueState"
], function (Controller, Global, Service, Util, TableItemsHelper, JSONModel, ContentResource, ContentConnector, threejs, ValueState) {
	"use strict";
	return Controller.extend("scm.ewm.PackingPOC.controller.Packing", {
		oItemHelper: new TableItemsHelper(new JSONModel([])),
		oProduct: {},
		onInit: function () {
			Service.getRuntimeEnvironment();
			Global.setWarehouseNumber("EW01");
			Global.setPackStation("WP02");
			// Service.verifyWorkCenter("WP02");
		},
		onSourceInputChange: function (oEvent) {
			var oInput = oEvent.getSource();
			var sInput = Util.trim(oEvent.getParameter("newValue")).toUpperCase();
			Global.setSourceId(sInput);
			Service.verifySource(sInput)
				.then(function (mResponse) {
					Global.setSourceId(mResponse.SourceId);
					Global.setSourceType(mResponse.SourceType);
					Global.setSourceMaterialId(mResponse.PackMat);
					Global.setIsPickHUInSourceSide(mResponse.IsPickHU);
				})
				.then(function () {
					return Service.getHUItems(Global.getSourceId());
				})
				.then(function (aItem) {
					this.oItemHelper.setItems(aItem);
					this.initThreejsModel();
				}.bind(this))
				.catch(function () {
					oInput.setValue("");
					oInput.setValueState(ValueState.Error);
					oInput.focus();
				});
		},
		onProductChange: function (oEvent) {
			var oInput = oEvent.getSource();
			var sInput = Util.trim(oEvent.getParameter("newValue")).toUpperCase();
			//fake access code PACK
			if (sInput === "PACK") {
				if (!Util.isEmpty(Global.getProductId())) {
					var fPackQuantity = Util.parseNumber(this.oProduct.AlterQuan);
					Service.pack(this.oProduct, fPackQuantity)
						.then(function () {
							// Add pack product to right side
						})
						.catch(function () {
							oInput.setValue("");
							oInput.setValueState(ValueState.Error);
							oInput.setValueStateText("Packing failed");
							oInput.focus();
						});
				} else {
					oInput.setValue("");
					oInput.setValueState(ValueState.Error);
					oInput.setValueStateText("Please scan product first");
					oInput.focus();
				}
			} else {
				var iIndex = this.oItemHelper.getItemIndexByProduct(sInput);
				if (iIndex !== -1) {
					this.oProduct = this.oItemHelper.getItemByIndex(iIndex);
				} else {
					oInput.setValue("");
					oInput.setValueState(ValueState.Error);
					oInput.focus();
				}
			}
			//move the selected product to the top of the item model

			//highlight selected product
			//indicate the position on 3d viewer

		},

		onPackProduct: function () {

		},
		initThreejsModel: function () {

			function threejsObjectLoader(parentNode, contentResource) {
				parentNode.add(contentResource.getSource());
				return Promise.resolve({
					node: parentNode,
					contentResource: contentResource
				});
			}

			function threejsContentManagerResolver(contentResource) {
				if (contentResource.getSource() instanceof THREE.Object3D) {
					return Promise.resolve({
						dimension: 3,
						contentManagerClassName: "sap.ui.vk.threejs.ContentManager",
						settings: {
							loader: threejsObjectLoader
						}
					});
				} else {
					return Promise.reject();
				}
			}

			ContentConnector.addContentManagerResolver(threejsContentManagerResolver);

			function initObject(obj, name, posX, posY, posZ, id) {
				obj.name = name;
				obj.position.set(posX, posY, posZ);
				obj.userData.treeNode = {
					sid: id
				};
			}

			var dx = 20,
				dy = 10;
			var root = new THREE.Group();
			initObject(root, "Root", 0, 0, 0, "0");

			var obj = new THREE.Mesh(
				new THREE.TorusBufferGeometry(5, 2, 16, 100),
				new THREE.MeshPhongMaterial({
					color: 0xC06000
				})
			);
			initObject(obj, "Torus1", -dx, dy, 0, "1");
			root.add(obj);

			obj = new THREE.Mesh(
				new THREE.TorusKnotBufferGeometry(4, 1, 256, 24),
				new THREE.MeshPhongMaterial({
					color: 0x00C0C0
				})
			);
			initObject(obj, "TorusKnot", 0, dy, 0, "2");
			root.add(obj);

			obj = new THREE.Mesh(
				new THREE.CylinderBufferGeometry(5, 5, 10, 48),
				new THREE.MeshPhongMaterial({
					color: 0xC00000
				})
			);
			initObject(obj, "Cylinder", dx, dy, 0, "3");
			root.add(obj);

			obj = new THREE.Mesh(
				new THREE.BoxBufferGeometry(10, 10, 10),
				new THREE.MeshPhongMaterial({
					color: 0x0000C0,
					shading: THREE.FlatShading
				})
			);
			initObject(obj, "Box", -dx, -dy, 0, "4");
			root.add(obj);

			obj = new THREE.Mesh(
				new THREE.ConeBufferGeometry(5, 10, 16),
				new THREE.MeshPhongMaterial({
					color: 0x00C000,
					shading: THREE.FlatShading
				})
			);
			initObject(obj, "Cone", 0, -dy, 0, "5");
			root.add(obj);

			obj = new THREE.Mesh(
				new THREE.DodecahedronBufferGeometry(6, 0),
				new THREE.MeshPhongMaterial({
					color: 0xC0C000,
					shading: THREE.FlatShading
				})
			);
			initObject(obj, "Dodecahedron", dx, -dy, 0, "6");
			root.add(obj);

			this.getView().byId("viewer").addContentResource(
				new ContentResource({
					source: root,
					sourceType: "THREE.Object3D",
					name: "Object3D"
				})
			);
		}
	});
});