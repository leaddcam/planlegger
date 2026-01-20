// server.js
// optional extra logs: node --trace-uncaught --trace-warnings --trace-exit server.js

const config = require("./config");

console.log("NODE_ENV:", config.env);
console.log("PORT:", config.server.port);

// hard crash visibility
process.on("uncaughtException", (err) => {
  console.error("!!! uncaughtException:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("!!! unhandledRejection:", err);
});
process.on("exit", (code) => {
  console.log("!!! process exit with code:", code);
});

// Express + middleware
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// request logger (first middleware)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: config.cors.origins,
    credentials: config.cors.credentials,
  })
);

// simple health endpoint (proves server is reachable)
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    pid: process.pid,
    env: config.env,
  });
});

// mount routes with safe "require" wrappers to surface load errors
function safeUse(prefix, modulePath) {
  try {
    const router = require(modulePath);
    app.use(prefix, router);
    console.log(`Mounted ${prefix} -> ${modulePath}`);
  } catch (err) {
    console.error(`!!! Failed to mount ${prefix} from ${modulePath}`);
    console.error(err);
    process.exitCode = 1;
  }
}

safeUse("/api/auth", "./routes/auth");
safeUse("/api/notater", "./routes/notater");
safeUse("/api/notatblokker", "./routes/notatblokker");

// Express error handler (catches next(err))
app.use((err, req, res, next) => {
  console.error("!!! Express error handler caught:", err);
  res.status(500).json({ error: "Internal server error" });
});

// start server with hard proof of binding
const server = app.listen(config.server.port, "0.0.0.0", () => {
  console.log("LISTEN OK:", server.address());
  console.log("Try these in browser:");
  console.log(`  http://127.0.0.1:${config.server.port}/health`);
  console.log(`  http://localhost:${config.server.port}/health`);
});

// if listen fails (e.g. EADDRINUSE), you WILL see it here
server.on("error", (err) => {
  console.error("!!! LISTEN ERROR:", err);
});

// if server gets closed, youll see who/when
server.on("close", () => {
  console.trace("!!! HTTP server CLOSE event fired");
});
