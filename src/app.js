import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import routes from "./routes/index.js";

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "https://avighnahc.com",
  "http://localhost:5174",
  "https://www.avighnahc.com",
  "https://avighna-self.vercel.app",
];

// ─── Security Headers ─────────────────────────────────────────────────
app.use(
  helmet({
    // Allow the frontend (different origin) to display images served by this API.
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// ─── Rate Limiters ────────────────────────────────────────────────────

// Strict limiter for login — 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    status: "error",
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General limiter for public POST routes (contact, reviews, applications)
const publicPostLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    status: "error",
    message: "Too many requests. Please slow down and try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply auth limiter to login route only
app.use("/api/auth/login", authLimiter);

// Apply public post limiter to submission routes
app.use("/api/inquiries", publicPostLimiter);
app.use("/api/reviews", publicPostLimiter);
app.use("/api/applications", publicPostLimiter);

// ─── Body Parsing ─────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── NoSQL Injection Sanitization ────────────────────────────────────
// Strips $ and . from req.body, req.params, req.query
// Prevents attacks like: { "email": { "$gt": "" } }
app.use(mongoSanitize());

// ─── HTTP Logger ──────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Health Check ─────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "Avighna API is running smoothly." });
});

// ─── API Routes ───────────────────────────────────────────────────────
app.use("/api", routes);

// ─── 404 Handler ──────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
