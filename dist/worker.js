// worker thread
import { workerData, parentPort } from "node:worker_threads";
import { diceRun } from "./dice.ts";
// start calculation
const stat = diceRun(workerData.throws, workerData.dice, workerData.sides);
// post message to parent script
parentPort === null || parentPort === void 0 ? void 0 : parentPort.postMessage(stat);
