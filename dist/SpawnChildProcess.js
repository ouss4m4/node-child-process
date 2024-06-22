import { spawn } from "node:child_process";
// execute shell command (10-minute timeout)
function execute(cmd, args = [], timeout = 600000) {
    return new Promise((resolve, reject) => {
        try {
            const exec = spawn(cmd, args, {
                timeout,
            });
            let ret = "";
            exec.stdout.on("data", (data) => {
                ret += "\n" + data;
            });
            exec.stderr.on("data", (data) => {
                ret += "\n" + data;
            });
            exec.on("close", (code) => {
                resolve({
                    complete: !code,
                    code,
                    result: ret.trim(),
                });
            });
        }
        catch (err) {
            reject({
                complete: false,
                code: err.code,
                result: err.message,
            });
        }
    });
}
// Function to be executed periodically
function periodicExecution() {
    try {
        console.log("am i held here?");
        execute("ls", ["-la"], 2500).then(console.log);
        console.log("Noo im not");
    }
    catch (error) {
        console.error("Error executing command:", error);
    }
}
// Set interval to run the function every 5 seconds (5000 milliseconds)
setInterval(periodicExecution, 1000);
