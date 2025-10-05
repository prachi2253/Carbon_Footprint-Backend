const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const monitorRouter = require("./routes/Monitoring");
const { monitorMatrices } = require("./controllers/Monitoring");
const UserRouter = require("./routes/UserRoutes");
const ActivityRouter = require("./routes/ActivityRoutes");
const dbconnection = require("./config/DB_Con");
const { createLogger } = require("winston");
const LokiTransport = require("winston-loki");

dotenv.config();
const app = express();
dbconnection();

// Logger setup
const logger = createLogger({
  transports: [
    new LokiTransport({
      host: "http://127.0.0.1:3100",
    }),
  ],
});

// Middlewares
app.use(express.json());

// Allow CORS from your frontend URL
const allowedOrigins = [
  "https://carbon-footprint-frontend-jet.vercel.app", 
  "http://localhost:3000",
  "http://localhost:3001"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Handle preflight requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).end();
});

// API routes
app.use("/activity", ActivityRouter);
app.use("/user", UserRouter);
app.use("/monitor", monitorRouter);
app.get("/metrics", monitorMatrices);

app.get("/", (req, res) => {
  res.send("Carbon footprint API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
