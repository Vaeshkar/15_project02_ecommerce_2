import { Request, Response, NextFunction } from "express";
import { Product, Category } from "../models";
import { CreateProductInput } from "../schemas";
import { TypedRequest } from "../types";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.query;
    const filter = categoryId ? { categoryId } : {};

    const products = await Product.find(filter).populate("categoryId", "name");
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryId",
      "name"
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: TypedRequest<CreateProductInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if category exists
    const category = await Category.findById(req.body.categoryId);
    if (!category) {
      return res.status(400).json({ error: "Category not found" });
    }

    const product = new Product(req.body);
    const savedProduct = await product.save();
    await savedProduct.populate("categoryId", "name");
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // If updating categoryId, check if it exists
    if (req.body.categoryId) {
      const category = await Category.findById(req.body.categoryId);
      if (!category) {
        return res.status(400).json({ error: "Category not found" });
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("categoryId", "name");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
