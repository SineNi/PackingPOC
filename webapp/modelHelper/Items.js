sap.ui.define([
	"scm/ewm/PackingPOC/utils/Util",
	"scm/ewm/PackingPOC/utils/Const",
	"scm/ewm/PackingPOC/modelHelper/Global"
], function (Util, Const, Global) {

	"use strict";

	function Items(oModel) {
		this._oModel = oModel;
	}

	jQuery.extend(Items.prototype, Error.prototype, {
		constructor: Items,
		getModel: function () {
			return this._oModel;
		},
		setItems: function (aItems) {
			this.initOrigId(aItems);
			this._oModel.setData(aItems);
			return this;
		},
		isStockLevelSnEnabledByIndex: function (iIndex) {
			var oItem = this._oModel.getData()[iIndex];
			return oItem.SnReq === Const.SERIAL_NUMBER_STOCK_LEVEL;
		},
		getItemIndexBySerialNumber: function (sProdcut, sSerialNumber) {
			var oProducts = this._oModel.getData();
			var iIndex = Util.findIndex(oProducts, function (oProduct, idx) {
				if (oProduct.SnReq === Const.SERIAL_NUMBER_STOCK_LEVEL && oProduct.Product === sProdcut) {
					if (this.isSerialNumberInSnListByIndex(idx, sSerialNumber)) {
						return true;
					}
				}
				return false;
			}.bind(this));

			return iIndex;
		},
		initOrigId: function (aItems) {
			aItems.forEach(function (oItems) {
				if (Util.isEmpty(oItems.OriginId)) {
					oItems.OriginId = oItems.StockId;
				}
			});
		},
		getAllItemsByProduct: function (sProduct) {
			var aItems = [];
			var oProducts = this._oModel.getData();
			oProducts.forEach(function (oProduct) {
				if (oProduct.Product === sProduct) {
					aItems.push(oProduct);
				}
			});
			return aItems;
		},
		isItemWithBatch: function (sValue) {
			var iIndex = this.getItemIndexByProduct(sValue);
			var oProducts = this._oModel.getData();
			return !Util.isEmpty(oProducts[iIndex].Batch);
		},
		getItemProductByIndex: function (iIndex) {
			return this._oModel.getData()[iIndex].Product;
		},
		getItemByIndex: function (iIndex) {
			return this._oModel.getData()[iIndex];
		},
		getItemDocIdByIndex: function (iIndex) {
			return this._oModel.getData()[iIndex].DocId;
		},
		getItemItmIdByIndex: function (iIndex) {
			return this._oModel.getData()[iIndex].ItmId;
		},
		getItemStockIdByIndex: function (iIndex) {
			return this._oModel.getData()[iIndex].StockId;
		},
		getItemDocNoByIndex: function (iIndex) {
			return this._oModel.getData()[iIndex].DocNo;
		},
		getItemQuantityByIndex: function (iIndex) {
			return this._oModel.getData()[iIndex].AlterQuan;
		},
		getItemBaseQtyByIndex: function (iIndex) {
			return this._oModel.getData()[iIndex].Quan;
		},
		getItemAlternativeUoMByIndex: function (iIndex) {
			return this._oModel.getData()[iIndex].AlterUnit;
		},
		getItemBaseUoMByIndex: function (iIndex) {
			return this._oModel.getData()[iIndex].BaseUnit;
		},
		getItemReductionQtyByIndex: function (iIndex) {
			return Util.formatNumber((Util.parseNumber(this._oModel.getData()[iIndex].AlterQuan) - Util.parseNumber(this._oModel.getData()[
				iIndex].QtyReduced)), 3);
		},
		isReductionFirstItem: function () {
			var oProduct = this.getItemByIndex(0);
			var bReduction = false;
			if (Util.parseNumber(oProduct.QtyReduced) !== 0) {
				if (oProduct.SnReq === Const.SN_DOC_LEVEL_PROFILE_A || oProduct.SnReq === Const.SERIAL_NUMBER_DISABLE) {
					bReduction = true;
				}
			}
			return bReduction;
		},

		updateItemQuantityByIndex: function (iIndex, sAlterQuantity, sBaseQuantity) {
			var sNewAlterQuantity = Util.formatNumber(parseFloat(sAlterQuantity), 3);
			var sNewBaseQuantity = Util.formatNumber(parseFloat(sBaseQuantity), 3);
			this._oModel.setProperty("/" + iIndex + "/AlterQuan", sNewAlterQuantity);
			this._oModel.setProperty("/" + iIndex + "/Quan", sNewBaseQuantity);
		},

		updateItemWeightByIndex: function (iIndex, sWeight, sWeightUom) {
			this._oModel.setProperty("/" + iIndex + "/Weight", Util.formatNumber(parseFloat(sWeight), 3, 3));
			this._oModel.setProperty("/" + iIndex + "/WeightUoM", sWeightUom);
		},

		updateItemVolumeByIndex: function (iIndex, sVolume, sVolumeUom) {
			this._oModel.setProperty("/" + iIndex + "/Volume", Util.formatNumber(parseFloat(sVolume), 3, 3));
			this._oModel.setProperty("/" + iIndex + "/VolumeUoM", sVolumeUom);
		},

		sortItemsByKey: function (sStockId) {
			var aProducts = this._oModel.getData();
			var aODOProducts = [];
			var iIndex;
			var oProduct = Util.find(aProducts, function (item, index) {
				iIndex = index;
				if (item.StockId === sStockId) {
					return true;
				}
				return false;
			});
			if (!oProduct) {
				return;
			}

			aODOProducts.push(oProduct);
			aProducts.splice(iIndex, 1);
			for (var i = 0; i < aProducts.length; i++) {
				var item = aProducts[i];
				if (item.ConsGrp === oProduct.ConsGrp) {
					aODOProducts.push(item);
					aProducts.splice(i, 1);
					i--;
				}
			}

			this.setItems(aODOProducts.concat(aProducts));
		},

		getItemIndexByKey: function (sStockId) {
			var aItems = this._oModel.getData();
			var iIndex = Util.findIndex(aItems, function (item) {
				if (item.StockId === sStockId) {
					return true;
				}
				return false;
			});
			return iIndex;
		},

		getItemIndexByProductAndActiveConsGroup: function (oProduct, sConsGroup) {
			var aItems = this._oModel.getData();
			var iIndex = Util.findIndex(aItems, function (item) {
				if (item.StockId === oProduct.StockId && sConsGroup === item.ConsGrp) {
					return true;
				}
				return false;
			});
			return iIndex;
		},

		getItemIndexByProductActiveConsGroupAndBatch: function (sProduct, sConsGroup, sBatch) {
			var aItems = this._oModel.getData();
			var iIndex = Util.findIndex(aItems, function (item) {
				if (item.Product === sProduct && sConsGroup === item.ConsGrp && sBatch === item.Batch) {
					return true;
				}
				return false;
			});

			return iIndex;
		},

		getItemIndexByProductAndBatch: function (sProduct, sBatch) {
			var aItems = this._oModel.getData();
			var iIndex = Util.findIndex(aItems, function (item) {
				if (item.Product === sProduct && sBatch === item.Batch) {
					return true;
				}
				return false;
			});
			return iIndex;
		},

		getItemIndexByProduct: function (sProduct) {
			var aItems = this._oModel.getData();
			var iIndex = Util.findIndex(aItems, function (item) {
				if (item.Product === sProduct) {
					return true;
				}
				return false;
			});
			return iIndex;
		},
		updateItemStockId: function (oItem, sStockId) {
			if (!Util.isEmpty(sStockId)) {
				oItem.OriginId = oItem.StockId;
				oItem.StockId = sStockId;
			}
			return oItem;
		},

		updateItemStockIdByKey: function (sOldStockId, sNewStockId) {
			var aItems = this.getAllItems();
			var iItemIndex;
			var oResult = Util.find(aItems, function (oItem, iIndex) {
				if (oItem.StockId === sOldStockId) {
					iItemIndex = iIndex;
					return true;
				}
				return false;
			});
			if (oResult) {
				aItems[iItemIndex].StockId = sNewStockId;
			}
		},
		getItemStockIdByOriginalId: function (sOriginId) {
			var aItems = this.getAllItems();
			var oResult = Util.find(aItems, function (oItem) {
				if (oItem.OriginId === sOriginId) {
					return true;
				}
				return false;
			});
			if (oResult) {
				return oResult.StockId;
			}
			return "";
		},

		addItem: function (oProduct, bCheckOriginId) {
			oProduct = this.mergeItem(oProduct, bCheckOriginId);
			var aProducts = this._oModel.getData();
			aProducts = aProducts.slice(0);
			aProducts.unshift(oProduct);

			this.setItems(aProducts);
		},
		addItemWithoutMerge: function (oProduct) {
			var aProducts = this._oModel.getData();
			aProducts = aProducts.slice(0);
			aProducts.unshift(oProduct);
			this.setItems(aProducts);
		},
		updateItem: function (oNewItem) {
			var aItems = this.getAllItems();
			var iItemIndex;
			var oResult = Util.find(aItems, function (oItem, iIndex) {
				if (oItem.StockId === oNewItem.StockId) {
					iItemIndex = iIndex;
					return true;
				}
				return false;
			});
			if (oResult) {
				oNewItem.SnList = Util.trim(oNewItem.SnList + " " + oResult.SnList);
				oNewItem.IuidList = Util.trim(oNewItem.IuidList + " " + oResult.IuidList);
				aItems[iItemIndex] = oNewItem;
			} else {
				aItems.unshift(oNewItem);
			}
			this.setItems(aItems);
			this._oModel.updateBindings(true);
		},
		//merge the existing item to the new item, then return it.
		mergeItem: function (mProduct, bCheckOriginId) {
			var aProducts = this._oModel.getData();
			var aResults;
			if (bCheckOriginId) {
				aResults = this.findItemAndIndexByStockIdAndOriginId(mProduct.StockId, mProduct.OriginId);
			} else {
				aResults = this.findItemAndIndexByStockId(mProduct.StockId);
			}
			var mExsitedProduct = aResults[0];
			var iItemIndex = aResults[1];

			if (mExsitedProduct) {
				if (mProduct.AlterUnit !== mExsitedProduct.AlterUnit) {
					mProduct.AlterQuan = mProduct.Quan;
					mProduct.AlterUnit = mProduct.BaseUnit;
				}
				//make sure it is still string after caculation
				//todo:: check if the number is formatted on odata level? if formatted, it will report error here
				mProduct.Quan = Util.formatNumber(Util.parseNumber(mProduct.Quan) + Util.parseNumber(mExsitedProduct.Quan), 3);
				mProduct.AlterQuan = Util.formatNumber(Util.parseNumber(mProduct.AlterQuan) + Util.parseNumber(mExsitedProduct.AlterQuan), 3);
				mProduct.SnList = Util.trim(mProduct.SnList + " " + mExsitedProduct.SnList);
				mProduct.IuidList = Util.trim(mProduct.IuidList + " " + mExsitedProduct.IuidList);
				aProducts.splice(iItemIndex, 1);
			}

			return mProduct;
		},
		findItemAndIndexByStockId: function (sStockId) {
			var aItems = this.getAllItems();
			var iItemIndex = -1;
			var oProduct = Util.find(aItems, function (oItem, index) {
				if (oItem.StockId === sStockId) {
					iItemIndex = index;
					return true;
				}
				return false;
			});
			return [oProduct, iItemIndex];
		},
		findItemAndIndexByStockIdAndOriginId: function (sStockId, sOriginId) {
			var aItems = this.getAllItems();
			var iItemIndex = -1;
			var oProduct = Util.find(aItems, function (oItem, index) {
				if (oItem.StockId === sStockId && oItem.OriginId === sOriginId) {
					iItemIndex = index;
					return true;
				}
				return false;
			});
			return [oProduct, iItemIndex];
		},
		deleteItem: function (oItem) {
			var aProducts = this._oModel.getData();
			var iIndex = this.getItemIndexByKey(oItem.StockId);
			aProducts = aProducts.slice(0);
			if (iIndex !== -1) {
				aProducts.splice(iIndex, 1);
			}

			this.setItems(aProducts);
		},
		addAllItems: function (aProducts) {
			aProducts.forEach(function (oProduct) {
				this.addItem(oProduct);
			}.bind(this));
		},
		clear: function () {
			this.setItems([]);
		},
		isEmpty: function () {
			var aProducts = this._oModel.getData();
			return aProducts.length === 0;
		},
		setItemsStatusByConsGrp: function () {
			var aProducts = this._oModel.getData();
			if (aProducts.length === 0) {
				return;
			}
			var sConsGroup = aProducts[0].ConsGrp;
			if (Util.isEmpty(sConsGroup)) {
				this.setItemsStatusToNone();
				// if (!PackingMode.isInternalMode() || !Util.isEmpty(Global.getProductId()) && Util.isEmpty(Global.getCurrentShipHandlingUnit())) {
					aProducts[0].Status = sap.ui.core.MessageType.Information;
				// }
			} else {
				aProducts.map(function (item, index) {
					if (sConsGroup !== "" && item.ConsGrp === sConsGroup) {
						item.Status = sap.ui.core.MessageType.Information;
					} else {
						item.Status = sap.ui.core.MessageType.None;
					}
				});
			}
			this.setItems(aProducts);
		},
		setItemsStatusToNone: function () {
			var aProducts = this._oModel.getData();
			if (aProducts.length === 0) {
				return;
			}
			aProducts.map(function (item, index) {
				item.Status = sap.ui.core.MessageType.None;
			});
			this.setItems(aProducts);
		},
		setItemHighlightByIndex: function (iIndex) {
			var aProducts = this._oModel.getData();
			if (aProducts.length === 0) {
				return;
			}
			var oProduct = this.getItemByIndex(iIndex);
			if (oProduct) {
				this._oModel.setProperty("/" + iIndex + "/Status", sap.ui.core.MessageType.Success);
			}
		},
		getHighLightedItem: function () {
			var aItems = this._oModel.getData();
			var oProduct = Util.find(aItems, function (oItem) {
				if (oItem.Status === sap.ui.core.MessageType.Success) {
					return true;
				}
				return false;
			});
			return oProduct;
		},
		getHighLightedItemIndex: function () {
			var aItems = this._oModel.getData();
			var idx = Util.findIndex(aItems, function (oItem) {
				if (oItem.Status === sap.ui.core.MessageType.Success) {
					return true;
				}
				return false;
			});
			return idx;
		},
		isSingleConsGroupNoReduction: function () {
			var aItems = this.getModel().getData();
			if (aItems.length !== 0) {
				var sConsGroup = aItems[0].ConsGrp;
				var oResult = Util.find(aItems, function (oItem) {
					if (oItem.ConsGrp !== sConsGroup || Util.parseNumber(oItem.QtyReduced) !== 0) {
						return true;
					}
				});
				if (oResult) {
					return false;
				}
				return true;
			} else {
				return false;
			}
		},
		getFirstItemConsGroup: function () {
			var aItems = this._oModel.getData();
			if (aItems.length !== 0) {
				return aItems[0].ConsGrp;
			}
		},

		isFirstItemHighlighted: function () {
			var aItems = this._oModel.getData();
			if (aItems.length > 0) {
				if (aItems[0].Status === sap.ui.core.MessageType.Success) {
					return true;
				}
			}
			return false;
		},

		getItemsNum: function () {
			return this._oModel.getData().length;
		},
		getAlternativeUOMRatio: function (oItem) {
			var fAlternativeQuantity = Util.parseNumber(oItem.AlterQuan);
			var fBaseQuantity = Util.parseNumber(oItem.Quan);
			return Util.parseNumber(Util.formatNumber(fBaseQuantity / fAlternativeQuantity, 3));
		},
		isSerialNumberEnable: function () {
			var aItems = this._oModel.getData();
			var oProduct = Util.find(aItems, function (mPro) {
				if (mPro.SnReq !== Const.SERIAL_NUMBER_DISABLE) {
					return true;
				}
				return false;
			});

			return !!oProduct;
		},

		isBatchEnable: function () {
			var aItems = this._oModel.getData();
			var oProduct = Util.find(aItems, function (mPro) {
				if (Util.isEmpty(mPro.Batch)) {
					return false;
				}
				return true;
			});

			return !!oProduct;
		},

		isStockLevelSerialNumber: function () {
			return this._oModel.getData()[0].SnReq === Const.SERIAL_NUMBER_STOCK_LEVEL;
		},
		getSerialNumberListByIndex: function (iIndex) {
			var oItem = this.getItemByIndex(iIndex);
			return this.getItemSerialNumber(oItem);
		},
		getItemSerialNumber: function (oItem) {
			return this.parseSerialNumber(oItem.SnList);
		},
		getItemSerialNumberUii: function (oItem) {
			return this.parseSerialNumberUii(oItem.SnList, oItem.IuidList);
		},
		getItemCountByProduct: function (sProduct) {
			var aItems = this._oModel.getData();
			var iCount = 0;
			aItems.forEach(function (oItem) {
				if (oItem.Product === sProduct) {
					iCount++;
				}
			});
			return iCount;
		},
		hasMutlipleBatchesByProduct: function (sProduct) {
			var aItems = this._oModel.getData();
			var sBatch = "";
			var bHasMutlipleBatch = false;
			Util.find(aItems, function (oItem) {
				if (oItem.Product === sProduct) {
					if (Util.isEmpty(sBatch)) {
						sBatch = oItem.Batch;
					}
					if (sBatch !== oItem.Batch) {
						bHasMutlipleBatch = true;
						return true;
					}
					return false;
				}
				return false;
			});
			return bHasMutlipleBatch;
		},
		getItemSerialNumberCountByIndex: function (iIndex) {
			var oItem = this.getItemByIndex(iIndex);
			return this.getItemSerialNumber(oItem).length;
		},
		isSerialNumberFullyAssignedByIndex: function (iIndex) {
			var iSnAssignedCount = this.getItemSerialNumberCountByIndex(iIndex);
			return iSnAssignedCount === Util.parseNumber(this.getItemBaseQtyByIndex(iIndex));
		},
		hasSerialNumber: function (sSerialNumber) {
			var aSerialNumberList = this.getSerialNumberListByIndex(0);
			return aSerialNumberList.indexOf(sSerialNumber) > -1;
		},

		removeSerialNumberFromItem: function (aRemoveSn, oItem) {
			var aSnList;
			if (Util.isEmpty(oItem)) {
				aSnList = this.getSerialNumberListByIndex(0);
			} else {
				aSnList = this.parseSerialNumber(oItem.SnList);
			}
			aRemoveSn.forEach(function (oSn) {
				var iIndex = aSnList.indexOf(oSn);
				if (iIndex === -1) {
					return;
				}
				aSnList = aSnList.slice(0);
				aSnList.splice(iIndex, 1);
			});
			if (Util.isEmpty(oItem)) {
				this._oModel.getData()[0].SnList = Util.formatSerialNumber(aSnList);
			} else {
				oItem.SnList = Util.formatSerialNumber(aSnList);
			}
		},
		removeIuidFromItem: function (oItem, sRemovedIuidList) {
			var aIuidList;
			var aRemovedIuidList = this.parseSerialNumber(sRemovedIuidList);
			if (Util.isEmpty(oItem)) {
				aIuidList = this.parseSerialNumber(this.getItemByIndex(0).IuidList);
			} else {
				aIuidList = this.parseSerialNumber(oItem.IuidList);
			}
			var iIndex;
			for (var i = 0; i < aRemovedIuidList.length; i++) {
				iIndex = aIuidList.indexOf(aRemovedIuidList[i]);
				if (iIndex !== -1) {
					aIuidList.splice(iIndex, 1);
				}
			}
			if (Util.isEmpty(oItem)) {
				this.getItemByIndex(0).IuidList = aIuidList.join(" ");
			} else {
				oItem.IuidList = aIuidList.join(" ");
			}
		},

		parseSerialNumber: function (sSerialNumber) {
			if (Util.isEmpty(sSerialNumber)) {
				return [];
			} else {
				return sSerialNumber.split(" ");
			}
		},
		parseSerialNumberUii: function (sSnList, sUiIdList) {
			if (Util.isEmpty(sSnList)) {
				return [];
			} else {
				var aSerialNumberAndUiIdList = [];

				var aSnList = sSnList.split(" ");
				var aUiIdList = sUiIdList.split(" ");
				for (var i = 0; i < aSnList.length; i++) {
					var oSerialObject = {};
					oSerialObject.SerialNum = aSnList[i];
					oSerialObject.UniqueItemIdentifier = aUiIdList[i] === "" ? " " : aUiIdList[i];
					aSerialNumberAndUiIdList.push(oSerialObject);
				}
				return aSerialNumberAndUiIdList;
			}
		},
		removeSerialNumberFromCurrentItem: function (aRemoveSn) {
			var aSnList = this.getSerialNumberListByIndex(0);
			aRemoveSn.forEach(function (oSn) {
				var iIndex = aSnList.indexOf(oSn);
				if (iIndex === -1) {
					return;
				}
				aSnList.splice(iIndex, 1);
			});
			this._oModel.getData()[0].SnList = Util.formatSerialNumber(aSnList);
		},
		removeSerialNumberUiiFromCurrentItem: function (aSnList, aRemoveSn) {
			var sIuidList = this.getItemByIndex(0).IuidList;
			var aIuidList = Util.isEmpty(sIuidList) ? [] : sIuidList.split(" ");
			var iIndex;
			for (var i = 0; i < aRemoveSn.length; i++) {
				iIndex = aSnList.indexOf(aRemoveSn[i]);
				if (iIndex !== -1) {
					aIuidList.splice(iIndex, 1);
				}
			}
			this.getItemByIndex(0).IuidList = aIuidList.join(" ");
		},
		removeSerialNumberFromOtherItems: function (sProduct, aRemoveSn) {
			var aItemIndex = this.getItemsIndexByProduct(sProduct);
			aItemIndex.forEach(function (iItemIndex) {
				if (aRemoveSn.length === 0) {
					return;
				}
				var isSerialNumberInSnList = false;
				for (var i = 0; i < aRemoveSn.length; i++) {
					if (this.isSerialNumberInSnListByIndex(iItemIndex, aRemoveSn[i])) {
						isSerialNumberInSnList = true;
						aRemoveSn.splice(i, 1);
						i--;
					}
				}
				if (isSerialNumberInSnList) {
					this.clearSnListByIndex(iItemIndex);
				}
			}.bind(this));
		},
		isSerialNumbersAllInSnListByIndex: function (iItemIndex, aSerailNumber) {
			var aSnList = this.getSerialNumberListByIndex(iItemIndex);
			if (aSnList.length === 0) {
				return false;
			}
			var bSerialNumbersAllInSnList = true;
			Util.find(aSerailNumber, function (oSerialNumber) {
				var iIndex = aSnList.indexOf(oSerialNumber);
				if (iIndex === -1) {
					bSerialNumbersAllInSnList = false;
					return false;
				}
			});
			return bSerialNumbersAllInSnList;
		},
		isSerialNumberInSnListByIndex: function (iItemIndex, sSerialNumber) {
			var aSnList = this.getSerialNumberListByIndex(iItemIndex);
			var iIndex = aSnList.indexOf(sSerialNumber);
			return iIndex !== -1;
		},
		clearSnListByIndex: function (iItemIndex) {
			this._oModel.getData()[iItemIndex].SnList = "";
		},
		getItemsIndexByProduct: function (sProduct) {
			var aItems = this._oModel.getData();
			var aIndex = [];
			aItems.forEach(function (oItem, iIndex) {
				if (oItem.Product === sProduct) {
					aIndex.push(iIndex);
				}
			});
			return aIndex;
		},
		isSerialNumberEnableItem: function () {
			return !!this.getItemByIndex(0).SnReq;
		},

		setFirstItemReductionQuantity: function () {
			var oProduct = this.getItemByIndex(0);
			var iRatio = this.getAlternativeUOMRatio(oProduct);

			oProduct.AlterQuan = (Util.parseNumber(oProduct.AlterQuan) - Util.parseNumber(oProduct.QtyReduced)).toString();
			oProduct.Quan = Util.formatNumber(oProduct.AlterQuan * iRatio, 3);
		},
		setItemQtyReducedInitialized: function () {
			var oProduct = this.getItemByIndex(0);
			if (oProduct) {
				oProduct.QtyReduced = "0";
			}
		},
		updateItemBothAlterQuantity: function (oItem, sQuantity) {
			oItem.AlterQuan = sQuantity;
			oItem.PreviousAlterQuan = sQuantity;
			this._oModel.updateBindings(true);
		},
		getAllItems: function () {
			return this.getModel().getData();
		},
		isItemsContainsBatchOrSN: function () {
			var aItmes = this.getAllItems();
			var oResult = Util.find(aItmes, function (oItem) {
				if (!Util.isEmpty(oItem.SnReq) || !Util.isEmpty(oItem.Batch)) {
					return true;
				}
				return false;
			});
			if (oResult) {
				return true;
			}
			return false;
		},
		reduceItemAlterQtyByIndex: function (iIndex, iQuantity) {
			//TODO:: Confirm with PO how to reduce with decimal case
			var oProduct = this.getItemByIndex(iIndex);
			oProduct.AlterQuan = (Util.parseNumber(oProduct.AlterQuan) - Util.parseNumber(iQuantity)).toString();
		},
		isItemsContainsConsGroup: function (sConsGroup) {
			var aItems = this.getAllItems();
			var oResult = Util.find(aItems, function (oItem) {
				if (oItem.ConsGrp === sConsGroup) {
					return true;
				}
				return false;
			});
			if (oResult) {
				return true;
			}
			return false;
		},
		setItemReductCancelByIndex: function (iIndex) {
			var oProduct = this.getItemByIndex(iIndex);
			if (oProduct.QuanDefault) {
				this._oModel.setProperty("/" + iIndex + "/Quan", oProduct.QuanDefault);
			}
		},
		setItemReductBaseQuanByIndex: function (iIndex, sQuantity) {
			this._oModel.setProperty("/" + iIndex + "/Quan", sQuantity);
		},
		/*
		 * @param {string} PreviousAlterQuan
		 * PreviousAlterQuan is used for basic mode quantity change input box due to
		 * calculate quantity with user input to do pack or unpack
		 * @public
		 */
		setItemPreviousAlterQuanByIndex: function (iIndex, sValue) {
			var oProduct = this.getItemByIndex(iIndex);
			this._oModel.setProperty("/" + iIndex + "/PreviousAlterQuan", sValue);
		},
		getItemPreviousAlterQuanByIndex: function (iIndex) {
			var oProduct = this.getItemByIndex(iIndex);
			return !!oProduct.PreviousAlterQuan ? oProduct.PreviousAlterQuan : "0";
		},
		/*
		 * Initial PreviousAlterQuan to all items
		 * @param {string} PreviousAlterQuan
		 * PreviousAlterQuan is used for basic mode quantity change input box due to
		 * calculate quantity with user input to do pack or unpack
		 * @public
		 */
		setItemsPreviousAlterQuan: function () {
			var aItems = this.getAllItems();
			aItems.map(function (oItem) {
				oItem.PreviousAlterQuan = oItem.AlterQuan;
			});
		},
		getItemByKey: function (sStockId) {
			var aItems = this._oModel.getData();
			var oResult = Util.find(aItems, function (oItem) {
				if (oItem.StockId === sStockId) {
					return true;
				}
				return false;
			});
			return oResult;
		},
		updatePendingStatus: function (oProduct, bPending) {
			var oItem = this.findItemAndIndexByStockIdAndOriginId(oProduct.StockId, oProduct.OriginId)[0];
			if (oItem) {
				oItem.Pending = bPending;
				this._oModel.updateBindings(true);
			}
		},
		updateHighlightStatus: function (oProduct, sStatus) {
			var oItem = this.getItemByKey(oProduct.StockId);
			if (oItem) {
				oItem.Status = sStatus;
			}
			this._oModel.updateBindings(true);
		},
		/*
		 * Initial OperationDeltaQuan for products in shipping handling unit, when user change package material failed then will set 
		 * OperationDeltaQuan to all products.
		 * @param {number} OperationDeltaQuan
		 * @public
		 */
		setItemsDeltaQuan: function () {
			var aItems = this.getAllItems();
			aItems.map(function (oItem) {
				oItem.OperationDeltaQuan = Util.parseNumber(oItem.AlterQuan);
			});
			this.setItems(aItems);
		},
		/*
		 * Initial PackedQuan for products in shipping handling unit, when user change package material failed then will set 
		 * PackedQuan to all products.
		 * @param {number} PackedQuan
		 * @public
		 */
		setItemsPackedQuan: function () {
			var aItems = this.getAllItems();
			aItems.map(function (oItem) {
				oItem.PackedQuan = Util.parseNumber(oItem.AlterQuan);
			});
			this.setItems(aItems);
		},
		/*
		 * Initial DefaultAltQuan for products in source, when user scan reference number and then will set DefaultAltQuan
		 * to all products. This value will not changed except close shipping hu. And will use this param to judge 100% quantity pack
		 * @param {number} DefaultAltQuan
		 * @public
		 */
		setItemsDefaultQuan: function (mItems) {
			var aItems = this.getAllItems();
			aItems.map(function (oItem) {
				if (mItems && mItems.length !== 0) {
					var mItem = Util.find(mItems, function (item) {
						if (oItem.StockId === item.StockId) {
							return true;
						}
						return false;
					});
					if (mItem && mItem.DefaultAltQuan !== oItem.DefaultAltQuan) {
						oItem.DefaultAltQuan = mItem.DefaultAltQuan;
					}
				} else {
					oItem.DefaultAltQuan = Util.parseNumber(oItem.AlterQuan);
				}
			});
			this.setItems(aItems);
		},
		/*
		 * Reset OperationDeltaQuan to actually packed quantity
		 * @param {number} OperationDeltaQuan
		 * @public
		 */
		resetItemsDefaultQuan: function (oItem) {
			oItem.OperationDeltaQuan = oItem.PackedQuan !== undefined ? oItem.PackedQuan : 0;
		},
		/*
		 * @param {number} OperationDeltaQuan
		 * OperationDeltaQuan is used for basic mode, user scan product one by one
		 * Plus, minus quantity, and give it current value
		 * @public
		 */
		setItemDeltaByIndex: function (iIndex, iQty, sOperator) {
			var oItem = this.getItemByIndex(iIndex);
			//First set the property to the item, then set the correct value to this property
			this._oModel.setProperty("/" + iIndex + "/OperationDeltaQuan", oItem.OperationDeltaQuan >= 0 ? oItem.OperationDeltaQuan : 0);
			if (sOperator === Const.OPERATOR.PLUS) {
				oItem.OperationDeltaQuan = oItem.OperationDeltaQuan + iQty;
			} else if (sOperator === Const.OPERATOR.MINUS) {
				oItem.OperationDeltaQuan = oItem.OperationDeltaQuan - iQty;
			} else {
				oItem.OperationDeltaQuan = iQty;
			}
		},
		/*
		 * @param {number} OperationDeltaQuan
		 * Get item OperationDeltaQuan, OperationDeltaQuan will remember currently user scan product quantity
		 * @public
		 * @return OperationDeltaQuan
		 */
		getItemDeltaByIndex: function (iIndex) {
			var oItem = this.getItemByIndex(iIndex);
			return oItem.OperationDeltaQuan;
		},
		/*
		 * @param {number} DefaultAltQuan
		 * DefaultAltQuan is used for basic mode, user scan reference number to initial this value for all items
		 * When user close shipping hu, the product in reference number not full quantity packed, will change this value
		 * @public
		 */
		setItemDefaultQuanByIndex: function (iIndex, iQty) {
			this._oModel.setProperty("/" + iIndex + "/DefaultAltQuan", iQty);
		},
		/*
		 * @param {number} DefaultAltQuan
		 * Get item DefaultAltQuan to judge if packing product 100% quantity reached
		 * @public
		 * @return DefaultAltQuan
		 */
		getItemDefaultQuanByIndex: function (iIndex) {
			var oItem = this.getItemByIndex(iIndex);
			return oItem.DefaultAltQuan;
		},
		/*
		 * When DefaultAltQuan === OperationDeltaQuan will send pack request to the server
		 * @public
		 * @return boolean
		 */
		getItemPackEnableByIndex: function (iIndex) {
			var oItem = this.getItemByIndex(iIndex);
			return oItem.DefaultAltQuan === oItem.OperationDeltaQuan;
		},
		/*
		 * When pack successfully, set PakcedQuan to packed quantity
		 * @public
		 */
		setItemPackedQuanByIndex: function (iIndex, iQty) {
			this._oModel.setProperty("/" + iIndex + "/PackedQuan", iQty);
		},
		setItemPackedQuan: function (oItem, iQty) {
			var oProduct = this.findItemAndIndexByStockIdAndOriginId(oItem.StockId, oItem.OriginId)[0];
			oProduct.PackedQuan = iQty;
			// this._oModel.updateBindings(true);
		},
		/*
		 * get item packed quantity
		 * @public
		 * @return PackedQuan
		 */
		getItemPackedQuanByIndex: function (iIndex) {
			var oItem = this.getItemByIndex(iIndex);
			return oItem.PackedQuan;
		},
		getItemConsGroupByIndex: function (iIndex) {
			var aItems = this._oModel.getData();
			if (!Util.isEmpty(aItems[iIndex])) {
				return aItems[iIndex].ConsGrp;
			}
		},
		getItemPackInstrByIndex: function (iIndex) {
			var aItems = this._oModel.getData();
			if (!Util.isEmpty(aItems[iIndex])) {
				return aItems[iIndex].PackInstr;
			}
		},
		getItemHandlingInstrByIndex: function (iIndex) {
			var aItems = this._oModel.getData();
			if (!Util.isEmpty(aItems[iIndex])) {
				return aItems[iIndex].HandlingInstr;
			}
		},
		updateItemQuantity: function (oItem, fQuantity, bMinus) {
			var iRatio = this.getAlternativeUOMRatio(oItem);
			var sNewAlterQuantity;
			if (bMinus === true) {
				sNewAlterQuantity = Util.formatNumber(Util.parseNumber(oItem.AlterQuan) - fQuantity, 3);
			} else {
				sNewAlterQuantity = Util.formatNumber(fQuantity, 3);
			}
			oItem.AlterQuan = sNewAlterQuantity;
			oItem.Quan = Util.formatNumber(Util.parseNumber(sNewAlterQuantity) * iRatio, 3);
			this._oModel.updateBindings(true);
		},

		isItemSplitEnable: function () {
			var aItems = this._oModel.getData();
			var oProduct = Util.find(aItems, function (oItem) {
				if (Util.isAbapTrue(oItem.isSplit)) {
					return true;
				}
				return false;
			});
			return !!oProduct;
		},
	});

	return Items;
});