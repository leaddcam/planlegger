// backend/config.js
require("dotenv").config();

function must(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
function optional(name, fallback) {
  const v = process.env[name];
  return (v && String(v).trim()) ? v : fallback;
}
function optionalInt(name, fallback) {
  const v = process.env[name];
  if (!v || !String(v).trim()) return fallback;
  const n = Number.parseInt(v, 10);
  if (Number.isNaN(n)) throw new Error(`Env var ${name} must be an integer. Got: ${v}`);
  return n;
}

const NODE_ENV = optional("NODE_ENV", "development");
const isProd = NODE_ENV === "production";

const config = {
  env: NODE_ENV,
  isProd,

  app: {
    origin: optional("APP_ORIGIN", "http://localhost:5173"),
  },

  auth: {
    jwtSecret: must("JWT_SECRET"),
    cookieName: optional("AUTH_COOKIE_NAME", "sid"),
    tokenDays: optionalInt("AUTH_TOKEN_DAYS", 7),
    cookie: {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      path: "/",
      // keep maxAge computed in code so it matches tokenDays
    },
  },

  db: {
  connectionString: must("DATABASE_URL"),
  testConnection: optional("DB_TEST_CONNECTION", "false") === "true",
  // ssl: isProd ? { rejectUnauthorized: false } : undefined,
  },

  server: {
    port: optionalInt("PORT", 3031),
  },
  cors: {
    origins: optional("CORS_ORIGINS", "http://localhost:5173")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean),
    credentials: true,
  },
  
  mail: {
    devSkipEmail: optional("DEV_SKIP_EMAIL", "false") === "true",
    from: optional("MAIL_FROM", "no-reply@example.com"),
    smtp: {
      host: optional("SMTP_HOST", "sandbox.smtp.mailtrap.io"),
      port: optionalInt("SMTP_PORT", 2525),
      user: optional("SMTP_USER", "user"),
      pass: optional("SMTP_PASS", "pass"),
    },
  },
};

module.exports = config;

