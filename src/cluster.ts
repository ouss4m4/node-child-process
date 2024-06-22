// app.js
import cluster from "node:cluster";
import process from "node:process";
import { cpus } from "node:os";
import http from "node:http";

const total_cpus = cpus().length;

if (cluster.isPrimary) {
  console.log(`Started primary process: ${process.pid}`);

  // fork workers
  for (let i = 0; i < total_cpus; i++) {
    cluster.fork();
  }

  // worker failure event
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} failed`);
    cluster.fork();
  });
} else {
  // start HTTP server on worker
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end("Hello!");
    })
    .listen(8080);

  console.log(`Started worker process:  ${process.pid}`);
}
