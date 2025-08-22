// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

// Import necessary modules
import express from "express";
import cors from "cors";
import { connectDB } from "./db/index";
import { errorHandler, notFoundHandler } from "./middleware/index";
import {
  userRouter,
  categoryRouter,
  productRouter,
  orderRouter,
  authRouter,
  aiRouter,
} from "./routers/index";
import { setupSwagger } from "./swagger";

// Create express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "E-commerce API is running!",
    documentation: `/api-docs`,
    endpoints: {
      users: "/users",
      categories: "/categories",
      products: "/products",
      orders: "/orders",
      auth: "/auth",
      ai: "/ai",
    },
  });
});

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

// 404 handler for unmatched routes
app.use("*", notFoundHandler);

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
