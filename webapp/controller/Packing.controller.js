sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"scm/ewm/PackingPOC/model/Global",
	"scm/ewm/PackingPOC/modelHelper/Global",
	"scm/ewm/PackingPOC/service/Service",
	"scm/ewm/PackingPOC/utils/Util",
	"scm/ewm/PackingPOC/modelHelper/Items",
	"sap/ui/model/json/JSONModel",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/thirdparty/three",
	"sap/ui/core/ValueState"
], function (Controller, GlobalModel, Global, Service, Util, TableItemsHelper, JSONModel, ContentResource, ContentConnector, threejs,
	ValueState) {
	"use strict";
	return Controller.extend("scm.ewm.PackingPOC.controller.Packing", {
		oItemHelper: new TableItemsHelper(new JSONModel([])),
		oProduct: {},
		root: new THREE.Group(),
		onInit: function () {
			this.getView().setModel(GlobalModel, "global");
			this.getView().setModel(this.oItemHelper.getModel(), "itemModel");
			// Service.getRuntimeEnvironment();
			Global.setWarehouseNumber("EW01");
			Global.setPackStation("WP02");
			Global.setBin("PACK-O01");
			// Service.verifyWorkCenter("WP02");
			this.initThreejsModel();
		},
		onSourceInputChange: function (oEvent) {
			var oInput = oEvent.getSource();
			var sInput = Util.trim(oEvent.getParameter("newValue")).toUpperCase();
			Global.setSourceId(sInput);
			Global.setBusy(true);
			Service.verifySource(sInput)
				.then(function (mResponse) {
					Global.setSourceId(mResponse.SourceId);
					Global.setSourceType(mResponse.SourceType);
					Global.setSourceMaterialId(mResponse.PackMat);
					Global.setIsPickHUInSourceSide(mResponse.IsPickHU);
					// this.createShippingHU("CARTON_L", 25, 25, 25);
					// this.createShippingHU(sMaterialId, ilength, iWidth, iHeight);
				}.bind(this))
				.then(function () {
					return Service.getHUItems(Global.getSourceId());
				})
				.then(function (aItem) {
					this.addSequence(aItem);
					this.oItemHelper.setItems(aItem);
					this.initProductImage();
					Global.setBusy(false);
				}.bind(this))
				.then(function () {
					oInput.setValueState(ValueState.None);
					this.byId("product-input").focus();
				}.bind(this))
				.catch(function () {
					oInput.setValue("");
					oInput.setValueState(ValueState.Error);
					oInput.focus();
					Global.setBusy(false);
				});
		},
		generateRandomArray: function (aArray) {
			var aNumber = aArray.slice();
			var iLength = aNumber.length;
			var temp, iRandomIndex;
			while (iLength != 0) {
				iRandomIndex = Math.round(0 + (iLength - 1 - 0) * Math.random());
				temp = aNumber[iRandomIndex];
				aNumber[iRandomIndex] = aNumber[iLength - 1];
				aNumber[iLength - 1] = temp;
				iLength--;
			}
			return aNumber;
		},

		addSequence: function (aItem) {
			var aRandomArray = this.generateRandomArray([1, 2, 3, 4]);
			for (var i = 0; i < aItem.length; i++) {
				aItem[i].sequence = aRandomArray[i];
				aItem[i].visible = true;
			}
			return aItem;
		},
		initProductImage: function () {
			Global.setImageVisible(true);
			var iIndex = this.oItemHelper.getItemIndexBySequence(1);
			this.highlightProductByIndex(iIndex + 1);
		},
		highlightProductByIndex: function (iIndex) {
			var sImageId = "image-" + iIndex;
			var oImage = this.getView().byId(sImageId);
			sImageId = oImage.getId();
			setTimeout(function () {
				$("#" + sImageId).removeClass("transparentBorder").addClass("border");
			}, 0);
		},
		onProductChange: function (oEvent) {
			var oInput = oEvent.getSource();
			var sInput = Util.trim(oEvent.getParameter("newValue")).toUpperCase();
			//fake access code PACK
			if (sInput === "PACK") {
				if (!Util.isEmpty(Global.getProductId())) {
					var fPackQuantity = Util.parseNumber(this.oProduct.AlterQuan);
					Global.setBusy(true);
					// Service.pack(this.oProduct, fPackQuantity)
					// 	.then(function () {
					this.addProduct(0, 0, 0, 10, 15, 10);
					// this.addProduct(iPositionX, iPositionY, iPositionZ, iLength, iWidth, iHeight);
					Global.setBusy(false);
					// })
					// .catch(function () {
					// 	oInput.setValue("");
					// 	oInput.setValueState(ValueState.Error);
					// 	oInput.setValueStateText("Packing failed");
					// 	oInput.focus();
					// 	Global.setBusy(false);
					// });
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

		createShippingHU: function (sMaterialId, ilength, iWidth, iHeight) {
			var sHuId = "";
			Service.createShippingHU(sHuId, sMaterialId)
				.then(function (oResult) {
					sHuId = oResult.HuId;
					Global.setCurrentShipHandlingUnit(sHuId);
					Global.setCurrentShipMaterial("Carton Large");
					Global.setCurrentShipHandlingUnitClosed(false);
					this.addHU(ilength, iWidth, iHeight);
				}.bind(this))
				.catch(function () {});
		},
		onPackProduct: function () {

		},
		threejsObjectLoader: function (parentNode, contentResource) {
			parentNode.add(contentResource.getSource());
			return Promise.resolve({
				node: parentNode,
				contentResource: contentResource
			});
		},
		threejsContentManagerResolver: function (contentResource) {
			var that = this;
			if (contentResource.getSource() instanceof THREE.Object3D) {
				return Promise.resolve({
					dimension: 3,
					contentManagerClassName: "sap.ui.vk.threejs.ContentManager",
					settings: {
						loader: that.threejsObjectLoader
					}
				});
			} else {
				return Promise.reject();
			}
		},
		initPosition: function (obj, name, posX, posY, posZ, id) {
			obj.name = name;
			obj.position.set(posX, posY, posZ);
			obj.userData.treeNode = {
				sid: id
			};
		},
		initThreejsModel: function () {
			ContentConnector.addContentManagerResolver(this.threejsContentManagerResolver.bind(this));

			this.initPosition(this.root, "Root", 0, 0, 0, "0");
			this.root.rotateY(45);
			// var obj;
			// obj = new THREE.Mesh(
			// 	new THREE.BoxBufferGeometry(25, 25, 25),
			// 	new THREE.MeshPhongMaterial({
			// 		color: 0x0000C0,
			// 		shading: THREE.FlatShading
			// 	})
			// );
			// this.initPosition(obj, "Box", 0, 0, 0, "1");
			// this.root.add(obj);

			this.getView().byId("viewer").addContentResource(
				new ContentResource({
					source: this.root,
					sourceType: "THREE.Object3D",
					name: "Object3D"
				})
			);
		},
		addHU: function (ilength, iWidth, iHeight) {
			var obj = new THREE.Mesh(
				new THREE.BoxBufferGeometry(ilength, iWidth, iHeight),
				new THREE.MeshPhongMaterial({
					color: 0x3EABFF,
					shading: THREE.FlatShading
				})
			);
			this.initPosition(obj, "Box", 0, 0, 0, "1");
			this.root.add(obj);
			this.getView().byId("viewer").addContentResource(
				new ContentResource({
					source: this.root,
					sourceType: "THREE.Object3D",
					name: "Object3D"
				})
			);
		},
		initProduct: function (iPositionX, iPositionY, iPositionZ, iLength, iWidth, iHeight, iColor) {
			var obj = new THREE.Mesh(
				new THREE.BoxBufferGeometry(10, 10, 10),
				new THREE.MeshPhongMaterial({
					color: 0x0000C0,
					shading: THREE.FlatShading
				})
			);
			this.initPosition(obj, "Box", iPositionX, iPositionY, iPositionZ);
			return obj;
		},
		addProduct: function () {
			var obj = this.initProduct();
			this.root.add(obj);
			this.getView().byId("viewer").addContentResource(
				new ContentResource({
					source: this.root,
					sourceType: "THREE.Object3D",
					name: "Object3D"
				})
			);
		}
	});
});