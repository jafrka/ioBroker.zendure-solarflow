"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var createSolarFlowStates_exports = {};
__export(createSolarFlowStates_exports, {
  createSolarFlowStates: () => createSolarFlowStates
});
module.exports = __toCommonJS(createSolarFlowStates_exports);
var import_aceStates = require("../constants/aceStates");
var import_aioStates = require("../constants/aioStates");
var import_hubStates = require("../constants/hubStates");
var import_hyperStates = require("../constants/hyperStates");
var import_adapterService = require("../services/adapterService");
var import_createCalculationStates = require("./createCalculationStates");
var import_createControlStates = require("./createControlStates");
const getStateDefinition = (type) => {
  switch (type) {
    case "aio":
      return import_aioStates.aioStates;
    case "hyper":
      return import_hyperStates.hyperStates;
    case "solarflow":
      return import_hubStates.hubStates;
    case "ace":
      return import_aceStates.aceStates;
    default:
      return [];
  }
};
const createSolarFlowStates = async (adapter, device, type) => {
  const productKey = device.productKey.replace(adapter.FORBIDDEN_CHARS, "");
  const deviceKey = device.deviceKey.replace(adapter.FORBIDDEN_CHARS, "");
  adapter.log.debug(
    `[createSolarFlowStates] Creating or updating SolarFlow states for ${device.productName} (${productKey}/${deviceKey}) and name '${device.name}'.`
  );
  await (adapter == null ? void 0 : adapter.extendObject(productKey, {
    type: "device",
    common: {
      name: {
        de: `${device.productName} (${productKey})`,
        en: `${device.productName} (${productKey})`
      }
    },
    native: {}
  }));
  await (adapter == null ? void 0 : adapter.extendObject(productKey + "." + deviceKey, {
    type: "channel",
    common: {
      name: {
        de: `${device.name} (${deviceKey})`,
        en: `${device.name} (${deviceKey})`
      }
    },
    native: {}
  }));
  await (adapter == null ? void 0 : adapter.extendObject(`${productKey}.${deviceKey}.calculations`, {
    type: "channel",
    common: {
      name: {
        de: "Berechnungen f\xFCr Ger\xE4t " + deviceKey,
        en: "Calculations for Device " + deviceKey
      }
    },
    native: {}
  }));
  await (adapter == null ? void 0 : adapter.extendObject(`${productKey}.${deviceKey}.packData`, {
    type: "channel",
    common: {
      name: {
        de: "Batterie Packs",
        en: "Battery packs"
      }
    },
    native: {}
  }));
  const states = getStateDefinition(type);
  states.forEach(async (state) => {
    await (adapter == null ? void 0 : adapter.extendObject(`${productKey}.${deviceKey}.${state.title}`, {
      type: "state",
      common: {
        name: {
          de: state.nameDe,
          en: state.nameEn
        },
        type: state.type,
        desc: state.title,
        role: state.role,
        read: true,
        write: false,
        unit: state.unit
      },
      native: {}
    }));
  });
  if (device.electricity) {
    await (0, import_adapterService.updateSolarFlowState)(
      adapter,
      device.productKey,
      device.deviceKey,
      "electricLevel",
      device.electricity
    );
  }
  if (device.snNumber) {
    await (0, import_adapterService.updateSolarFlowState)(
      adapter,
      device.productKey,
      device.deviceKey,
      "snNumber",
      device.snNumber.toString()
    );
  }
  await (0, import_adapterService.updateSolarFlowState)(
    adapter,
    device.productKey,
    device.deviceKey,
    "productName",
    device.productName
  );
  await (0, import_adapterService.updateSolarFlowState)(
    adapter,
    device.productKey,
    device.deviceKey,
    "wifiState",
    device.wifiStatus ? "Connected" : "Disconnected"
  );
  if (!adapter.config.useFallbackService) {
    await (0, import_createControlStates.createControlStates)(adapter, productKey, deviceKey, type);
  }
  if (adapter.config.useCalculation && (type == "aio" || type == "solarflow" || type == "hyper")) {
    await (0, import_createCalculationStates.createCalculationStates)(adapter, productKey, deviceKey);
  } else {
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createSolarFlowStates
});
//# sourceMappingURL=createSolarFlowStates.js.map
