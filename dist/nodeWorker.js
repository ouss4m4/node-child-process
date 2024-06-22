// worker thread demonstration
import { Worker } from "node:worker_threads";
import { performance } from "node:perf_hooks";
import { diceRun } from "./dice.ts";
import { clear } from "node:console";
// globals
const intlTime = new Intl.DateTimeFormat([], { timeStyle: "medium" });
// dice configuration
const throws = 100000000, dice = 2, sides = 6;
let timer = null;
// launch processes
function start() {
    if (timer) {
        return;
    }
    clear();
    // timer
    timer = setInterval(() => {
        console.log(`  timer process ${intlTime.format(new Date())}`);
    }, 1000);
    setTimeout(runNoWorker, 3000);
}
// dice run without a worker
function runNoWorker() {
    console.log("\u001b[36;1mNO THREAD CALCULATION STARTED...\u001b[0m");
    const start = performance.now();
    const stat = diceRun(throws, dice, sides);
    const end = performance.now();
    console.table(stat);
    console.log(`processing time: ${Math.ceil(end - start)}ms`);
    console.log("\u001b[36;1mNO THREAD CALCULATION COMPLETE\u001b[0m\n");
    setTimeout(runWorker, 3000);
}
// dice run with a worker
function runWorker() {
    console.log("\u001b[36;1mWORKER CALCULATION STARTED...\u001b[0m");
    const start = performance.now();
    const worker = new Worker("./src/worker.ts", {
        workerData: { throws, dice, sides },
    });
    // result returned
    worker.on("message", (result) => {
        console.table(result);
    });
    // worker error
    worker.on("error", (e) => {
        console.log(e);
        worker.terminate();
    });
    // worker complete
    worker.on("exit", (code) => {
        const end = performance.now();
        console.log(`processing time: ${Math.ceil(end - start)}ms`);
        console.log("\u001b[36;1mWORKER CALCULATION COMPLETE\u001b[0m\n");
        setTimeout(stop, 3000);
    });
}
// end program
function stop() {
    clearInterval(timer);
    timer = null;
}
start();
