import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "@/db";
import { errorHandler } from "@/middleware";
import {
  userRouter,
  categoryRouter,
  productRouter,
  orderRouter,
  authRouter,
  aiRouter,
} from "@/routers";
import { setupSwagger } from "./swagger";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/demo", express.static("demo"));

// Routes
app.use("/users", userRouter);
app.use("/categories", categoryRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/auth", authRouter);
app.use("/ai", aiRouter);

// Setup Swagger documentation
setupSwagger(app);

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
