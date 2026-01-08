import express from "express";
import cors from "cors";

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
    res.json({ 
        message: "VMC Civic Issue Monitoring API", 
        status: "running",
        version: "1.0.0"
    });
});

// API Routes
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// TODO: Add your route imports here
// app.use("/api/auth", authRoutes);
// app.use("/api/issues", issueRoutes);
// app.use("/api/users", userRoutes);

export default app;