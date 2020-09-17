sap.ui.define([
	"scm/ewm/PackingPOC/utils/Util",
	"scm/ewm/PackingPOC/utils/Const",
	"scm/ewm/PackingPOC/modelHelper/Global",
	"scm/ewm/PackingPOC/modelHelper/Material"
], function (Util, Const, Global, Material) {
	"use strict";
	var _oModel;
	return {
		init: function (oDataModel) {
			_oModel = oDataModel;
			return this;
		},
		destroy: function () {
			_oModel = null;
		},
		getDefaultBinPath: function (sBin) {
			sBin = this.encodeSpecialCharacter(sBin);
			var sTemplate = "/PackingStationSet(Lgnum=''{0}'',Workstation=''{1}'',Bin=''{2}'')";
			return Util.formatText(sTemplate, [Global.getWarehouseNumber(), Global.getPackStation(), sBin]);
		},
		getWorkCenterPath: function (sWorkCenter) {
			sWorkCenter = this.encodeSpecialCharacter(sWorkCenter);
			var sTemplate = "/PackingStationSet(Lgnum=''{0}'',Workstation=''{1}'',Bin='''')";
			return Util.formatText(sTemplate, [Global.getWarehouseNumber(), sWorkCenter]);
		},
		getHUPath: function (sHUId, sHUType) {
			if (!sHUId) {
				sHUId = Global.getSourceId();
			}
			if (sHUType === undefined) {
				sHUType = Global.getSourceType();
			}
			sHUId = this.encodeSpecialCharacter(sHUId);
			var sTemplate = "/HUSet(HuId=''{0}'',Bin=''{1}'',Lgnum=''{2}'',Workstation=''{3}'',Type=''{4}'')";
			return Util.formatText(sTemplate, [sHUId, Global.getBin(), Global.getWarehouseNumber(), Global.getPackStation(), sHUType]);
		},
		getUpdateHUPath: function () {
			var sHuId = this.encodeSpecialCharacter(Global.getCurrentShipHandlingUnit());
			var sTemplate = "/HUSet(HuId=''{0}'',Lgnum=''{1}'',Workstation=''{2}'',Bin=''{3}'',Type=''1'')";
			return Util.formatText(sTemplate, [sHuId, Global.getWarehouseNumber(), Global.getPackStation(), Global.getBin()]);
		},
		getHUInfo: function (sHuId, sType) {
			var sPath = this.getHUPath(sHuId, sType);
			return _oModel.getProperty(sPath);
		},
		getHUItemsPath: function (sHuid, sType) {
			return this.getHUPath(sHuid, sType) + "/Items";
		},
		getPackagingMaterialPath: function () {
			var sTemplate = "/PackingStationSet(Lgnum=''{0}'',Workstation=''{1}'',Bin='''')/PackMats";
			return Util.formatText(sTemplate, [Global.getWarehouseNumber(), Global.getPackStation()]);
		},
		getProductPath: function (sStockId) {
			var sTemplate = "/ItemSet(guid''{0}'')";
			return Util.formatText(sTemplate, sStockId);
		},
		getShipHUMaterialId: function (sHuid) {
			var sPath = this.getHUPath(sHuid, Const.SHIP_TYPE_HU) + "/Packmat";
			return _oModel.getProperty(sPath);
		},
		getPackageMaterial: function () {
			var oMaterial = Material.getCurrentMaterial();
			return oMaterial.PackmatId;
		},
		getExceptionPackParameters: function (oProduct, iQty, sExccode, sUoM) {
			return {
				"Lgnum": "'" + Global.getWarehouseNumber() + "'",
				"Workstation": "'" + Global.getPackStation() + "'",
				"Bin": "'" + Global.getBin() + "'",
				"SourceId": "'" + Global.getSourceId() + "'",
				"ShippingHUId": "'" + Global.getCurrentShipHandlingUnit() + "'",
				"SourceType": "'" + Global.getSourceType() + "'",
				"IsPackAll": false,
				"PackMat": "'" + this.getPackageMaterial() + "'",
				"Quan": iQty + "M",
				"Exccode": "'" + sExccode + "'",
				"SnList": "'" + oProduct.SnList + "'",
				"StockId": "guid'" + oProduct.StockId + "'",
				"UoM": sUoM ? "'" + sUoM + "'" : "''"
			};
		},
		getPackParameters: function (oProduct, fQuantity, sUoM) {
			var oParamater = {
				"Lgnum": "'" + Global.getWarehouseNumber() + "'",
				"Workstation": "'" + Global.getPackStation() + "'",
				"Bin": "'" + Global.getBin() + "'",
				"SourceId": "'" + Global.getSourceId() + "'",
				"ShippingHUId": "'" + Global.getCurrentShipHandlingUnit() + "'",
				"SourceType": "'" + Global.getSourceType() + "'",
				"IsPackAll": false,
				"PackMat": "'" + this.getPackageMaterial() + "'",
				"SnList": "'" + oProduct.SnList + "'",
				"OrdReduction": Util.parseNumber(oProduct.QtyReduced) !== 0 ? true : false,
				"StockId": "guid'" + oProduct.StockId + "'",
				"UoM": sUoM ? "'" + sUoM + "'" : "''"
			};
			if (fQuantity) {
				oParamater.Quan = fQuantity + "M";
			}
			return oParamater;
		},

		getPackAllParameters: function (aProducts) {
			return {
				"Lgnum": "'" + Global.getWarehouseNumber() + "'",
				"Workstation": "'" + Global.getPackStation() + "'",
				"Bin": "'" + Global.getBin() + "'",
				"SourceId": "'" + Global.getSourceId() + "'",
				"ShippingHUId": "'" + Global.getCurrentShipHandlingUnit() + "'",
				"SourceType": "'" + Global.getSourceType() + "'",
				"IsPackAll": true,
				"PackMat": "'" + this.getPackageMaterial() + "'"
			};
		},

		getUnpackParameters: function (oProduct, bNeedQuantity) {
			var oParamater = {
				"Lgnum": "'" + Global.getWarehouseNumber() + "'",
				"Workstation": "'" + Global.getPackStation() + "'",
				"Bin": "'" + Global.getBin() + "'",
				"SourceId": "'" + Global.getSourceId() + "'",
				"ShippingHUId": "'" + Global.getCurrentShipHandlingUnit() + "'",
				"SourceType": "'" + Global.getSourceType() + "'",
				"StockId": "guid'" + oProduct.StockId + "'",
				"IsUnPackAll": false,
				"PackMat": "'" + Global.getSourceMaterialId() + "'"
			};
			if (bNeedQuantity) {
				oParamater.Quan = Util.parseNumber(oProduct.AlterQuan) + "M";
			}
			return oParamater;
		},
		getPrintParameters: function () {
			return {
				"Lgnum": "'" + Global.getWarehouseNumber() + "'",
				"Workstation": "'" + Global.getPackStation() + "'",
				"Bin": "'" + Global.getBin() + "'",
				"HUId": "'" + Global.getCurrentShipHandlingUnit() + "'"
			};
		},

		getUnpackAllParameters: function (aProducts) {
			return {
				"Lgnum": "'" + Global.getWarehouseNumber() + "'",
				"Workstation": "'" + Global.getPackStation() + "'",
				"Bin": "'" + Global.getBin() + "'",
				"SourceId": "'" + Global.getSourceId() + "'",
				"ShippingHUId": "'" + Global.getCurrentShipHandlingUnit() + "'",
				"SourceType": "'" + Global.getSourceType() + "'",
				"IsUnPackAll": true,
				"Quan": "0M",
				"PackMat": "'" + Global.getSourceMaterialId() + "'"
			};
		},

		getCloseShipHandlingUnitParameters: function () {
			var oParameters = {
				"Lgnum": "'" + Global.getWarehouseNumber() + "'",
				"Workstation": "'" + Global.getPackStation() + "'",
				"ShippingHUId": "'" + Global.getCurrentShipHandlingUnit() + "'",
				"Bin": "'" + Global.getBin() + "'"
			};
			return oParameters;
		},

		getChangeMaterialParameters: function (sHuId) {
			var oParameters = {
				"Lgnum": "'" + Global.getWarehouseNumber() + "'",
				"Workstation": "'" + Global.getPackStation() + "'",
				"Bin": "'" + Global.getBin() + "'",
				"SourceId": "''",
				"ShippingHUIdOld": "'" + Global.getCurrentShipHandlingUnit() + "'",
				"ShippingHUIdNew": "'" + sHuId + "'",
				"SourceType": "'" + Global.getSourceType() + "'",
				"SourcePackMat": "'" + Global.getSourceMaterialId() + "'",
				"ShippingHUPackMat": "'" + Material.getSelectedMaterialId() + "'"
			};
			return oParameters;
		},
		getVarifyProductEANParameters: function (sValue) {
			var oParameters = {
				"Lgnum": "'" + Global.getWarehouseNumber() + "'",
				"Workstation": "'" + Global.getPackStation() + "'",
				"Bin": "'" + Global.getBin() + "'",
				"Product": "'" + sValue + "'"
			};
			return oParameters;
		},
		getDeleteHUParameters: function () {
			var oParameters = {
				"Lgnum": "'" + Global.getWarehouseNumber() + "'",
				"Workstation": "'" + Global.getPackStation() + "'",
				"Bin": "'" + Global.getBin() + "'",
				"SourceId": "''",
				"ShippingHUIdOld": "'" + Global.getCurrentShipHandlingUnit() + "'",
				"ShippingHUIdNew": "''",
				"SourceType": "'" + Global.getSourceType() + "'",
				"SourcePackMat": "'" + Global.getSourceMaterialId() + "'",
				"ShippingHUPackMat": "'" + Material.getSelectedMaterialId() + "'",
				"DeleteShippingHUOnly": "true"
			};
			return oParameters;
		},
		getValidateSnParamters: function (oProduct, sSn) {
			return {
				"Lgnum": "'" + Global.getWarehouseNumber() + "'",
				"Workstation": "'" + Global.getPackStation() + "'",
				"Bin": "'" + Global.getBin() + "'",
				"SourceId": "'" + Global.getSourceId() + "'",
				"ShippingHUId": "'" + Global.getCurrentShipHandlingUnit() + "'",
				"SourceType": "'" + Global.getSourceType() + "'",
				"DocId": "guid'" + oProduct.DocId + "'",
				"ItmId": "guid'" + oProduct.ItmId + "'",
				"Product": "'" + oProduct.Product + "'",
				"Sn": "'" + sSn + "'",
				"StockId": "guid'" + oProduct.StockId + "'"
			};
		},
		getScaleWeightData: function () {
			return {
				"Lgnum": Global.getWarehouseNumber(),
				"Workstation": Global.getPackStation(),
				"Bin": Global.getBin(),
				"Huid": this.encodeSpecialCharacter(Global.getCurrentShipHandlingUnit())
			};
		},
		encodeSpecialCharacter: function (sInput) {
			if (!Util.isEmpty(sInput)) {
				return sInput.replace(/#/g, "%23");
			}
		},
		isShipHUClosed: function (sHuId) {
			var bClosed = false;
			var mHU;
			sHuId = sHuId ? sHuId : Global.getCurrentShipHandlingUnit();
			if (!Util.isEmpty(sHuId) && (mHU = this.getHUInfo(sHuId, Const.SHIP_TYPE_HU))) {
				bClosed = mHU.Closed;
			}
			return bClosed;
		}
	};
});