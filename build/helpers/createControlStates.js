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
var createControlStates_exports = {};
__export(createControlStates_exports, {
  createControlStates: () => createControlStates
});
module.exports = __toCommonJS(createControlStates_exports);
const createControlStates = async (adapter, productKey, deviceKey) => {
  await (adapter == null ? void 0 : adapter.extendObjectAsync(`${productKey}.${deviceKey}.control`, {
    type: "channel",
    common: {
      name: {
        de: "Steuerung f\xFCr Ger\xE4t " + deviceKey,
        en: "Control for device " + deviceKey
      }
    },
    native: {}
  }));
  await (adapter == null ? void 0 : adapter.extendObjectAsync(
    `${productKey}.${deviceKey}.control.setOutputLimit`,
    {
      type: "state",
      common: {
        name: {
          de: "Einzustellende Ausgangsleistung",
          en: "Control of the output limit"
        },
        type: "number",
        desc: "setOutputLimit",
        role: "value.power",
        read: true,
        write: true,
        min: 0,
        unit: "W"
      },
      native: {}
    }
  ));
  await (adapter == null ? void 0 : adapter.extendObjectAsync(
    `${productKey}.${deviceKey}.control.chargeLimit`,
    {
      type: "state",
      common: {
        name: {
          de: "Setzen des Lade-Limits",
          en: "Control of the charge limit"
        },
        type: "number",
        desc: "chargeLimit",
        role: "value.battery",
        read: true,
        write: true,
        min: 40,
        max: 100,
        unit: "%"
      },
      native: {}
    }
  ));
  await (adapter == null ? void 0 : adapter.extendObjectAsync(
    `${productKey}.${deviceKey}.control.dischargeLimit`,
    {
      type: "state",
      common: {
        name: {
          de: "Setzen des Entlade-Limits",
          en: "Control of the discharge limit"
        },
        type: "number",
        desc: "dischargeLimit",
        role: "value.battery",
        read: true,
        write: true,
        min: 0,
        max: 90,
        unit: "%"
      },
      native: {}
    }
  ));
  await (adapter == null ? void 0 : adapter.extendObjectAsync(
    `${productKey}.${deviceKey}.control.buzzerSwitch`,
    {
      type: "state",
      common: {
        name: {
          de: "Sounds am HUB aktivieren",
          en: "Enable buzzer on HUB"
        },
        type: "boolean",
        desc: "buzzerSwitch",
        role: "switch",
        read: true,
        write: true
      },
      native: {}
    }
  ));
  await (adapter == null ? void 0 : adapter.extendObjectAsync(
    `${productKey}.${deviceKey}.control.passMode`,
    {
      type: "state",
      common: {
        name: {
          de: "Einstellung des Bypass Modus",
          en: "Setting of bypass mode"
        },
        type: "number",
        desc: "passMode",
        role: "switch",
        read: true,
        write: true,
        states: {
          0: "Automatic",
          1: "Always off",
          2: "Always on"
        }
      },
      native: {}
    }
  ));
  await (adapter == null ? void 0 : adapter.extendObjectAsync(
    `${productKey}.${deviceKey}.control.autoRecover`,
    {
      type: "state",
      common: {
        name: {
          de: "Am n\xE4chsten Tag Bypass auf Automatik",
          en: "Automatic recovery of bypass"
        },
        type: "boolean",
        desc: "autoRecover",
        role: "switch",
        read: true,
        write: true
      },
      native: {}
    }
  ));
    await (adapter == null ? void 0 : adapter.extendObjectAsync(
    `${productKey}.${deviceKey}.control.autoHeat`,
    {
      type: "state",
      common: {
        name: {
          de: "autoHeat",
          en: "autoHeat"
        },
        type: "boolean",
        desc: "autoHeat",
        role: "switch",
        read: true,
        write: true
      },
      native: {}
    }
  ));
  if (adapter.config.useLowVoltageBlock) {
    await (adapter == null ? void 0 : adapter.extendObjectAsync(
      `${productKey}.${deviceKey}.control.lowVoltageBlock`,
      {
        type: "state",
        common: {
          name: {
            de: "Niedrige Batteriespannung erkannt",
            en: "Low Voltage on battery detected"
          },
          type: "boolean",
          desc: "lowVoltageBlock",
          role: "indicator.lowbat",
          read: true,
          write: false
        },
        native: {}
      }
    ));
    adapter == null ? void 0 : adapter.subscribeStates(
      `${productKey}.${deviceKey}.control.lowVoltageBlock`
    );
  }
  adapter == null ? void 0 : adapter.subscribeStates(`${productKey}.${deviceKey}.control.setOutputLimit`);
  adapter == null ? void 0 : adapter.subscribeStates(`${productKey}.${deviceKey}.control.chargeLimit`);
  adapter == null ? void 0 : adapter.subscribeStates(`${productKey}.${deviceKey}.control.dischargeLimit`);
  adapter == null ? void 0 : adapter.subscribeStates(`${productKey}.${deviceKey}.control.buzzerSwitch`);
  adapter == null ? void 0 : adapter.subscribeStates(`${productKey}.${deviceKey}.control.autoRecover`);
  adapter == null ? void 0 : adapter.subscribeStates(`${productKey}.${deviceKey}.control.passMode`);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createControlStates
});
//# sourceMappingURL=createControlStates.js.map
