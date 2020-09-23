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
		"sap/ui/core/ValueState",
		"sap/ui/vk/Camera"
	], function (Controller, GlobalModel, Global, Service, Util, TableItemsHelper, JSONModel, ContentResource, ContentConnector, threejs,
		ValueState, Camera) {
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
				for (var i = 1; i <= 4; i++) {
					this.removeTextByIndex(i);
				}
			},
			onSourceInputChange: function (oEvent) {
				this.clearObject();
				var oInput = oEvent.getSource();
				var sInput = Util.trim(oEvent.getParameter("newValue")).toUpperCase();
				Global.setSourceId(sInput);
				Global.setBusy(true);
				// Service.verifySource(sInput)
				// 	.then(function (mResponse) {
				// 		Global.setSourceId(mResponse.SourceId);
				// 		Global.setSourceType(mResponse.SourceType);
				// 		Global.setSourceMaterialId(mResponse.PackMat);
				// 		Global.setIsPickHUInSourceSide(mResponse.IsPickHU);
				this.createShippingHU("CARTON_L", 25, 25, 25);
				// 		// this.createShippingHU(sMaterialId, ilength, iWidth, iHeight);
				// 	}.bind(this))
				// 	.then(function () {
				var aItem = [{
					"__metadata": {
						"id": "https://ldciuyt.wdf.sap.corp:44300/sap/opu/odata/SCWM/PACK_OUTBDLV_SRV/ItemSet(guid'0894ef45-7741-1eda-bec6-efbf1b00c69e')",
						"uri": "https://ldciuyt.wdf.sap.corp:44300/sap/opu/odata/SCWM/PACK_OUTBDLV_SRV/ItemSet(guid'0894ef45-7741-1eda-bec6-efbf1b00c69e')",
						"type": "pack_outbdlv_srv.Item"
					},
					"ParentId": "40f2e9af-c501-1eea-9e8f-aabcf1cf5304",
					"StockId": "0894ef45-7741-1eda-bec6-efbf1b00c69e",
					"DocId": "3863bb44-f021-1ed7-8689-67735892fb07",
					"ItmId": "3863bb44-f021-1ed7-8689-e7f3bbacde5e",
					"ConsGrp": "0005000387",
					"BaseUnit": "EA",
					"AlterUnit": "EA",
					"Quan": "1",
					"AlterQuan": "1",
					"DocNo": "310000042209",
					"HuId": "800100761",
					"Batch": "0000142770",
					"SnReq": "",
					"SnList": "",
					"IuidList": "",
					"Product": "PROD-S01",
					"ProductDesc": "Batch Managed Material EWM Team 3",
					"ProductWeight": "0.000",
					"ProductUoM": "",
					"Type": "1",
					"Workstation": "WP02",
					"HandlingInstr": "",
					"EAN": "",
					"PrdtPicURL": "",
					"Lgnum": "EW01",
					"Bin": "PACK-O01",
					"QtyReduced": "0",
					"isSplit": "X",
					"isIuidActive": "",
					"StockType": "F2",
					"StockTypeText": "Unrestricted-Use Warehouse",
					"Weight": "0.100",
					"WeightUoM": "KG",
					"Volume": "1.500",
					"VolumeUoM": "CD3",
					"ItemsSerialNumber": {
						"__deferred": {
							"uri": "https://ldciuyt.wdf.sap.corp:44300/sap/opu/odata/SCWM/PACK_OUTBDLV_SRV/ItemSet(guid'0894ef45-7741-1eda-bec6-efbf1b00c69e')/ItemsSerialNumber"
						}
					}
				}, {
					"__metadata": {
						"id": "https://ldciuyt.wdf.sap.corp:44300/sap/opu/odata/SCWM/PACK_OUTBDLV_SRV/ItemSet(guid'40f2e9af-be79-1ed7-bcba-a256f42b6da2')",
						"uri": "https://ldciuyt.wdf.sap.corp:44300/sap/opu/odata/SCWM/PACK_OUTBDLV_SRV/ItemSet(guid'40f2e9af-be79-1ed7-bcba-a256f42b6da2')",
						"type": "pack_outbdlv_srv.Item"
					},
					"ParentId": "40f2e9af-c501-1eea-9e8f-aabcf1cf5304",
					"StockId": "40f2e9af-be79-1ed7-bcba-a256f42b6da2",
					"DocId": "3863bb44-f021-1ed7-8689-67735892fb07",
					"ItmId": "3863bb44-f021-1ed7-8689-e7f3bbacde5e",
					"ConsGrp": "0005000387",
					"BaseUnit": "EA",
					"AlterUnit": "EA",
					"Quan": "2",
					"AlterQuan": "2",
					"DocNo": "310000042209",
					"HuId": "800100761",
					"Batch": "0000142770",
					"SnReq": "",
					"SnList": "",
					"IuidList": "",
					"Product": "PROD-S02",
					"ProductDesc": "Batch Managed Material EWM Team 3",
					"ProductWeight": "0.000",
					"ProductUoM": "",
					"Type": "1",
					"Workstation": "WP02",
					"HandlingInstr": "",
					"EAN": "",
					"PrdtPicURL": "",
					"Lgnum": "EW01",
					"Bin": "PACK-O01",
					"QtyReduced": "0",
					"isSplit": "X",
					"isIuidActive": "",
					"StockType": "F2",
					"StockTypeText": "Unrestricted-Use Warehouse",
					"Weight": "0.200",
					"WeightUoM": "KG",
					"Volume": "3.000",
					"VolumeUoM": "CD3",
					"ItemsSerialNumber": {
						"__deferred": {
							"uri": "https://ldciuyt.wdf.sap.corp:44300/sap/opu/odata/SCWM/PACK_OUTBDLV_SRV/ItemSet(guid'40f2e9af-be79-1ed7-bcba-a256f42b6da2')/ItemsSerialNumber"
						}
					}
				}, {
					"__metadata": {
						"id": "https://ldciuyt.wdf.sap.corp:44300/sap/opu/odata/SCWM/PACK_OUTBDLV_SRV/ItemSet(guid'3863bb44-f021-1ed7-8689-e7f3bbb2be5e')",
						"uri": "https://ldciuyt.wdf.sap.corp:44300/sap/opu/odata/SCWM/PACK_OUTBDLV_SRV/ItemSet(guid'3863bb44-f021-1ed7-8689-e7f3bbb2be5e')",
						"type": "pack_outbdlv_srv.Item"
					},
					"ParentId": "40f2e9af-c501-1eea-9e8f-aabcf1cf5304",
					"StockId": "3863bb44-f021-1ed7-8689-e7f3bbb2be5e",
					"DocId": "3863bb44-f021-1ed7-8689-67735892fb07",
					"ItmId": "3863bb44-f021-1ed7-8689-e7f3bbacde5e",
					"ConsGrp": "0005000387",
					"BaseUnit": "EA",
					"AlterUnit": "EA",
					"Quan": "2",
					"AlterQuan": "2",
					"DocNo": "310000042209",
					"HuId": "800100761",
					"Batch": "0000142770",
					"SnReq": "",
					"SnList": "",
					"IuidList": "",
					"Product": "PROD-S03",
					"ProductDesc": "Batch Managed Material EWM Team 3",
					"ProductWeight": "0.000",
					"ProductUoM": "",
					"Type": "1",
					"Workstation": "WP02",
					"HandlingInstr": "",
					"EAN": "",
					"PrdtPicURL": "",
					"Lgnum": "EW01",
					"Bin": "PACK-O01",
					"QtyReduced": "0",
					"isSplit": "X",
					"isIuidActive": "",
					"StockType": "F2",
					"StockTypeText": "Unrestricted-Use Warehouse",
					"Weight": "0.200",
					"WeightUoM": "KG",
					"Volume": "3.000",
					"VolumeUoM": "CD3",
					"ItemsSerialNumber": {
						"__deferred": {
							"uri": "https://ldciuyt.wdf.sap.corp:44300/sap/opu/odata/SCWM/PACK_OUTBDLV_SRV/ItemSet(guid'3863bb44-f021-1ed7-8689-e7f3bbb2be5e')/ItemsSerialNumber"
						}
					}
				}, {
					"__metadata": {
						"id": "https://ldciuyt.wdf.sap.corp:44300/sap/opu/odata/SCWM/PACK_OUTBDLV_SRV/ItemSet(guid'3863bb44-f021-1ed7-8689-e7f3bbb25e5e')",
						"uri": "https://ldciuyt.wdf.sap.corp:44300/sap/opu/odata/SCWM/PACK_OUTBDLV_SRV/ItemSet(guid'3863bb44-f021-1ed7-8689-e7f3bbb25e5e')",
						"type": "pack_outbdlv_srv.Item"
					},
					"ParentId": "40f2e9af-c501-1eea-9e8f-aabcf1cf5304",
					"StockId": "3863bb44-f021-1ed7-8689-e7f3bbb25e5e",
					"DocId": "3863bb44-f021-1ed7-8689-67735892fb07",
					"ItmId": "3863bb44-f021-1ed7-8689-e7f3bbacde5e",
					"ConsGrp": "0005000387",
					"BaseUnit": "EA",
					"AlterUnit": "EA",
					"Quan": "1",
					"AlterQuan": "1",
					"DocNo": "310000042209",
					"HuId": "800100761",
					"Batch": "0000142770",
					"SnReq": "",
					"SnList": "",
					"IuidList": "",
					"Product": "PROD-S04",
					"ProductDesc": "Batch Managed Material EWM Team 3",
					"ProductWeight": "0.000",
					"ProductUoM": "",
					"Type": "1",
					"Workstation": "WP02",
					"HandlingInstr": "",
					"EAN": "",
					"PrdtPicURL": "",
					"Lgnum": "EW01",
					"Bin": "PACK-O01",
					"QtyReduced": "0",
					"isSplit": "X",
					"isIuidActive": "",
					"StockType": "F2",
					"StockTypeText": "Unrestricted-Use Warehouse",
					"Weight": "0.100",
					"WeightUoM": "KG",
					"Volume": "1.500",
					"VolumeUoM": "CD3",
					"ItemsSerialNumber": {
						"__deferred": {
							"uri": "https://ldciuyt.wdf.sap.corp:44300/sap/opu/odata/SCWM/PACK_OUTBDLV_SRV/ItemSet(guid'3863bb44-f021-1ed7-8689-e7f3bbb25e5e')/ItemsSerialNumber"
						}
					}
				}];
				// return Service.getHUItems(Global.getSourceId());
				// })
				// .then(function (aItem) {
				this.addSequence(aItem);
				Global.setMaxSequence(aItem.length);
				this.oItemHelper.setItems(aItem);
				this.highlightProductBySequence(1);
				//same size
				// this.addProduct(1, 10, 10, 10, -8, -8, -8, 0xFFFFFF);
				//different size
				this.addProduct(1, 25.8, 10, 9.8, 0, -8, -8, 0xFFFFFF);
				Global.setBusy(false);
				// }.bind(this))
				// .then(function () {
				oInput.setValueState(ValueState.None);
				this.byId("product-input").focus();
				// }.bind(this))
				// .catch(function () {
				// 	oInput.setValue("");
				// 	oInput.setValueState(ValueState.Error);
				// 	oInput.focus();
				// 	Global.setBusy(false);
				// });
				for (var i = 1; i <= 4; i++) {
					this.addImageByIndex(i);
				}
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
					aItem[i].src = "./css/product" + aRandomArray[i] + ".jpg";
				}
				return aItem;
			},
			formatTextVisible: function (oItem, a) {
				if (Util.isEmpty(oItem)) {
					return false;
				} else {
					return true;
				}
			},
			highlightProductBySequence: function (iSequence) {
				var iIndex = this.oItemHelper.getItemIndexBySequence(iSequence) + 1;
				var sImageId = "image-" + iIndex;
				var oImage = this.getView().byId(sImageId);
				sImageId = oImage.getId();
				setTimeout(function () {
					$("#" + sImageId).removeClass("transparentBorder").addClass("border");
				}, 0);
			},
			removeProductBySequence: function (iSequence) {
				this.oItemHelper.setVisibleBySequence(iSequence, false);
				var iIndex = this.oItemHelper.getItemIndexBySequence(iSequence) + 1;
				this.removeImageByIndex(iIndex);
				this.removeTextByIndex(iIndex);
			},
			removeTextByIndex: function (iIndex) {
				var sTextId = "text-" + iIndex;
				var oText = this.getView().byId(sTextId);
				sTextId = oText.getId();
				$("#" + sTextId).addClass("transparent");
			},
			addTextByIndex: function (iIndex) {
				var sTextId = "text-" + iIndex;
				var oText = this.getView().byId(sTextId);
				sTextId = oText.getId();
				$("#" + sTextId).removeClass("transparent");
			},
			addImageByIndex: function (iIndex) {
				setTimeout(function () {
					var sImageId = "image-" + iIndex;
					var oImage = this.getView().byId(sImageId);
					sImageId = oImage.getId();
					$("#" + sImageId).removeClass("transparent");
				}.bind(this), 0);
			},
			removeImageByIndex: function (iIndex) {
				var sImageId = "image-" + iIndex;
				var oImage = this.getView().byId(sImageId);
				sImageId = oImage.getId();
				$("#" + sImageId).addClass("transparentBorder").removeClass("border").addClass("transparent");
			},
			//all product with same size
			// onProductChange: function (oEvent) {
			// 	var oInput = oEvent.getSource();
			// 	oInput.setValue("");
			// 	oInput.focus();
			// 	var iSequence = Global.getCurrentSequence();
			// 	switch (iSequence) {
			// 	case 1:
			// 		this.changeProductColorBySequence(iSequence);
			// 		this.addProduct(iSequence + 1, 10, 10, 10, -8 + 11 * (iSequence), -8, -8, 0xFFFFFF);
			// 		break;
			// 	case 2:
			// 		this.changeProductColorBySequence(iSequence);
			// 		this.addProduct(iSequence + 1, 10, 10, 10, -8, -8, -8 + 11 * (iSequence - 1), 0xFFFFFF);
			// 		break;
			// 	case 3:
			// 		this.changeProductColorBySequence(iSequence);
			// 		this.addProduct(iSequence + 1, 10, 10, 10, -8 + 11 * (iSequence - 2), -8, -8 + 11 * (iSequence - 2), 0xFFFFFF);
			// 		break;
			// 	case 4:
			// 		this.changeProductColorBySequence(iSequence);
			// 		break;
			// 	default:
			// 		break;
			// 	}

			// // if (iSequence < 2) {
			// // 	this.changeProductColorBySequence(iSequence);
			// // 	this.addProduct(iSequence + 1, 10, 10, 10, -8 + 11 * (iSequence), -8, -8, 0xFFFFFF);
			// // } else {
			// // 	this.changeProductColorBySequence(iSequence);
			// // 	this.addProduct(iSequence + 1, 10, 10, 10, -8, -8, -8 + 11 * (iSequence - 1), 0xFFFFFF);
			// // }

			// this.updateSourceAfterPacking();

			// //highlight selected product
			// for ( var i=0; i < iSequence; i++) {
			// 	PositionX, iPositionY, iPositionZ, iLength, iWidth, iHeight, iColor = this.readSpec(iSequence);
			// 	initProduct(iPositionX, iPositionY, iPositionZ, iLength, iWidth, iHeight, iColor);
			// }
			////indicate the position on 3d viewer
			// },

			onProductChange: function (oEvent) {
				var oInput = oEvent.getSource();
				oInput.setValue("");
				oInput.focus();
				var iSequence = Global.getCurrentSequence();
				switch (iSequence) {
				case 1:
					this.changeProductColorBySequence(iSequence);
					this.addProduct(iSequence + 1, 10, 10, 15.8, -8, -8, 5, 0xFFFFFF);
					break;
				case 2:
					this.changeProductColorBySequence(iSequence);
					this.addProduct(iSequence + 1, 15, 10, 7, 4.6, -8, 0.5, 0xFFFFFF);
					break;
				case 3:
					this.changeProductColorBySequence(iSequence);
					this.addProduct(iSequence + 1, 12, 10, 8.8, 3.1, -8, 8.5, 0xFFFFFF);
					break;
				case 4:
					this.changeProductColorBySequence(iSequence);
					break;
				default:
					break;
				}
				this.updateSourceAfterPacking();

				//	highlight selected product
				for (var i = 0; i < iSequence; i++) {
					PositionX,
					iPositionY,
					iPositionZ,
					iLength,
					iWidth,
					iHeight,
					iColor = this.readSpec(iSequence);
					initProduct(iPositionX, iPositionY, iPositionZ, iLength, iWidth, iHeight, iColor);
				}
				// indicate the position on 3 d viewer
			},
			updateSourceAfterPacking: function () {
				var iSequence = Global.getCurrentSequence();
				this.removeProductBySequence(iSequence);
				// this.removeImageByIndex(iSequence);
				// this.removeTextByIndex(iSequence);
				if (iSequence < Global.getMaxSequence()) {
					Global.setCurrentSequence(iSequence + 1);
					this.highlightProductBySequence(iSequence + 1);
				} else {
					var oSourceInput = this.getView().byId("source-input");
					oSourceInput.setValue("");
					oSourceInput.focus();
				}
			},

			createShippingHU: function (sMaterialId, ilength, iWidth, iHeight) {
				var sHuId = "HU1000" + parseInt(100 * Math.random());
				// Service.createShippingHU(sHuId, sMaterialId)
				// 	.then(function (oResult) {
				// 		sHuId = oResult.HuId;
				Global.setCurrentShipHandlingUnit(sHuId);
				Global.setCurrentShipMaterial("Carton Small");
				Global.setCurrentShipHandlingUnitClosed(false);
				this.addHU(ilength, iWidth, iHeight);
				// }.bind(this))
				// .catch(function () {});
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

				var camera = new THREE.PerspectiveCamera(40, 579 / 496, 1, 1000);
				this.initPosition(camera, "camera", 0, 0, 0, "7");
				this.root.add(camera);

				this.root.add(new THREE.AmbientLight(0x222222));
				var light = new THREE.PointLight(0xffffff, 1);
				camera.add(light);
				this.root.rotateY(-38);
				// this.root.rotateX(0.5);

				var axes = new THREE.AxesHelper(35);
				this.initPosition(axes, "axe", -13, -13, -13, "1");
				this.root.add(axes);

				this.getView().byId("viewer").addContentResource(
					new ContentResource({
						source: this.root,
						sourceType: "THREE.Object3D",
						name: "Object3D"
					})
				);
			},
			addHU: function (ilength, iWidth, iHeight) {
				var meshMaterial = new THREE.MeshLambertMaterial({
					color: 0xFFFFFF,
					opacity: 0.3,
					transparent: true
				});

				var meshGeometry = new THREE.BoxBufferGeometry(26, 26, 26);

				var mesh = new THREE.Mesh(meshGeometry, meshMaterial);
				mesh.material.side = THREE.BackSide; // back faces
				mesh.renderOrder = 0;
				this.initPosition(mesh, "BigBox+", 0, 0, 0, "2")
				this.root.add(mesh);

				var mesh_ = new THREE.Mesh(meshGeometry, meshMaterial.clone());
				mesh_.material.side = THREE.FrontSide; // front faces
				mesh_.renderOrder = 1;
				this.initPosition(mesh_, "BigBox-", 0, 0, 0, "3");
				this.root.add(mesh_);
				
				// this.root.add(obj);
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
					new THREE.MeshLambertMaterial({
						color: 0xFFFFFF
							// shading: THREE.FlatShading
					})
				);
				this.initPosition(obj, "Box", iPositionX, iPositionY, iPositionZ);
				this.root.add(obj)
				return obj;
			},
			addProduct: function (sName, iLength, iWidth, iHeight, iPositionX, iPositionY, iPositionZ, iColor) {
				var meshMaterial = new THREE.MeshLambertMaterial({
					// color: iColor,
					color: 0x3EABFF
						// opacity: 0.8,
						// transparent: true
				});

				var meshGeometry = new THREE.BoxBufferGeometry(iLength, iWidth, iHeight);

				var mesh = new THREE.Mesh(meshGeometry, meshMaterial);
				mesh.material.side = THREE.BackSide; // back faces
				mesh.renderOrder = 0;
				this.initPosition(mesh, sName + "+", iPositionX, iPositionY, iPositionZ, "2")
				this.root.add(mesh);

				var mesh_ = new THREE.Mesh(meshGeometry, meshMaterial.clone());
				mesh_.material.side = THREE.FrontSide; // front faces
				mesh_.renderOrder = 1;
				this.initPosition(mesh_, sName + "-", iPositionX, iPositionY, iPositionZ, "3");
				this.root.add(mesh_);

				// this.root.add(obj);
				this.getView().byId("viewer").addContentResource(
					new ContentResource({
						source: this.root,
						sourceType: "THREE.Object3D",
						name: "Object3D"
					})
				);
			},
			changeProductColorBySequence: function (iSequence) {
				var oFront = this.root.getChildByName(iSequence + "+");
				var oBack = this.root.getChildByName(iSequence + "-");
				this.root.remove(oFront);
				this.root.remove(oBack);
				var meshMaterial = new THREE.MeshLambertMaterial({
					// color: iColor,
					color: 0xFFFFFF
						// opacity: 0.8,
						// transparent: true
				});
				var oGeometry = oFront.geometry.parameters;
				var oPosition = oFront.position;

				var meshGeometry = new THREE.BoxBufferGeometry(oGeometry.width, oGeometry.height, oGeometry.depth);

				var mesh = new THREE.Mesh(meshGeometry, meshMaterial);
				mesh.material.side = THREE.BackSide; // back faces
				mesh.renderOrder = 0;
				this.initPosition(mesh, iSequence + "+", oPosition.x, oPosition.y, oPosition.z, "2")
				this.root.add(mesh);

				var mesh_ = new THREE.Mesh(meshGeometry, meshMaterial.clone());
				mesh_.material.side = THREE.FrontSide; // front faces
				mesh_.renderOrder = 1;
				this.initPosition(mesh_, iSequence + "-", oPosition.x, oPosition.y, oPosition.z, "3");
				this.root.add(mesh_);

				var edges = new THREE.EdgesGeometry( meshGeometry );
				var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xff0000} ) );
				this.initPosition(line, iSequence + "e", oPosition.x, oPosition.y, oPosition.z, "4");
				this.root.add( line );
				
				this.getView().byId("viewer").addContentResource(
					new ContentResource({
						source: this.root,
						sourceType: "THREE.Object3D",
						name: "Object3D"
					})
				);
			},
			clearObject: function () {
				Global.setCurrentSequence(1);
				var oFront, oBack, oEdge;
				for (var i = 1; i <= 4; i++) {
					this.removeImageByIndex(i);
					this.addTextByIndex(i);
					this.addImageByIndex(i);
					oFront = this.root.getChildByName(i + "+");
					oBack = this.root.getChildByName(i + "-");
					oEdge = this.root.getChildByName(i + "e");
					this.root.remove(oFront);
					this.root.remove(oBack);
					this.root.remove(oEdge);
				}
				oFront = this.root.getChildByName("BigBox+");
				oBack = this.root.getChildByName("BigBox-");
				this.root.remove(oFront);
				this.root.remove(oBack);
				this.getView().byId("viewer").addContentResource(
					new ContentResource({
						source: this.root,
						sourceType: "THREE.Object3D",
						name: "Object3D"
					})
				);
			},
			formatImageUrl: function (iSequence) {
				if (Util.isEmpty(iSequence)) {
					return "";
				} else {
					return "./css/product" + iSequence + ".jpg";
				}
			}
		});
	});