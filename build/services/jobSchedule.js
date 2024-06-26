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
var jobSchedule_exports = {};
__export(jobSchedule_exports, {
  startCalculationJob: () => startCalculationJob,
  startCheckStatesJob: () => startCheckStatesJob,
  startRefreshAccessTokenTimerJob: () => startRefreshAccessTokenTimerJob,
  startResetValuesJob: () => startResetValuesJob
});
module.exports = __toCommonJS(jobSchedule_exports);
var import_node_schedule = require("node-schedule");
var import_mqttService = require("./mqttService");
var import_webService = require("./webService");
var import_calculationService = require("./calculationService");
const startRefreshAccessTokenTimerJob = async (adapter) => {
  adapter.refreshAccessTokenInterval = adapter.setInterval(() => {
    var _a;
    adapter.log.info(`[startRefreshAccessTokenTimerJob] Refreshing accessToken!`);
    if (adapter.mqttClient) {
      adapter.mqttClient.end();
      adapter.mqttClient = void 0;
    }
    if (adapter.config.userName && adapter.config.password) {
      (_a = (0, import_webService.login)(adapter)) == null ? void 0 : _a.then((_accessToken) => {
        adapter.accessToken = _accessToken;
        adapter.lastLogin = /* @__PURE__ */ new Date();
        adapter.setState("info.connection", true, true);
        (0, import_mqttService.connectMqttClient)(adapter);
      });
    }
  }, 3 * 60 * 60 * 1e3);
};
const startResetValuesJob = async (adapter) => {
  adapter.resetValuesJob = (0, import_node_schedule.scheduleJob)("5 0 0 * * *", () => {
    (0, import_calculationService.resetTodaysValues)(adapter);
  });
};
const startCalculationJob = async (adapter) => {
  adapter.calculationJob = (0, import_node_schedule.scheduleJob)("*/30 * * * * *", () => {
    adapter.deviceList.forEach((device) => {
      (0, import_calculationService.calculateEnergy)(adapter, device.productKey, device.deviceKey);
    });
  });
};
const startCheckStatesJob = async (adapter) => {
  const statesToReset = [
    "outputHomePower",
    "outputPackPower",
    "packInputPower",
    "solarInputPower"
  ];
  adapter.checkStatesJob = (0, import_node_schedule.scheduleJob)("*/10 * * * *", async () => {
    (0, import_webService.getDeviceList)(adapter).then((deviceList) => {
      deviceList.forEach(async (device) => {
        const lastUpdate = await (adapter == null ? void 0 : adapter.getStateAsync(
          device.productKey + "." + device.deviceKey + ".lastUpdate"
        ));
        const tenMinutesAgo = Date.now() / 1e3 - 10 * 60;
        if (lastUpdate && lastUpdate.val && Number(lastUpdate.val) < tenMinutesAgo) {
          adapter.log.debug(
            `[checkStatesJob] Last update for deviceKey ${device.deviceKey} was at ${new Date(
              Number(lastUpdate)
            )}, checking for pseudo power values!`
          );
          await statesToReset.forEach(async (stateName) => {
            await (adapter == null ? void 0 : adapter.setStateAsync(
              device.productKey + "." + device.deviceKey + "." + stateName,
              0,
              true
            ));
          });
          if (device.electricity) {
            await (adapter == null ? void 0 : adapter.setStateAsync(
              device.productKey + "." + device.deviceKey + ".electricLevel",
              device.electricity,
              true
            ));
          }
        }
      });
    }).catch(() => {
      var _a;
      (_a = adapter.log) == null ? void 0 : _a.error(
        "[checkStatesJob] Retrieving device failedRetrieving device failed!"
      );
    });
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  startCalculationJob,
  startCheckStatesJob,
  startRefreshAccessTokenTimerJob,
  startResetValuesJob
});
//# sourceMappingURL=jobSchedule.js.map
