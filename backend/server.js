// optional extra logs: node --trace-uncaught --trace-warnings --trace-exit server.js

// load env once, early
require("dotenv").config();
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT env:", process.env.PORT);

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
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// simple health endpoint (proves server is reachable)
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    pid: process.pid,
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
    // if a route module can't load, it's usually best to stop immediately
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
const PORT = Number(process.env.PORT || 3031);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("LISTEN OK:", server.address());
  console.log(`Try these in browser:`);
  console.log(`  http://127.0.0.1:${PORT}/health`);
  console.log(`  http://localhost:${PORT}/health`);
});

// if listen fails (e.g. EADDRINUSE), you WILL see it here
server.on("error", (err) => {
  console.error("!!! LISTEN ERROR:", err);
});

// if server gets closed, youll see who/when
server.on("close", () => {
  console.trace("!!! HTTP server CLOSE event fired");
});

