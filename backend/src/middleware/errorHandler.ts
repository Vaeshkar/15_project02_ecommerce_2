import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  // Mongoose validation error
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err: any) => err.message);
    return res.status(400).json({ error: "Validation Error", details: errors });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    return res.status(400).json({ error: "Duplicate field value entered" });
  }

  // Mongoose cast error (invalid ObjectId)
  if (error.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  // Default error
  res.status(500).json({ error: "Internal server error" });
};
