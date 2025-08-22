import { z } from "zod";

// Product validation schemas
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Product name is required").trim(),
    description: z.string().min(1, "Product description is required").trim(),
    price: z.number().positive("Price must be a positive number"),
    categoryId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format"),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID format"),
  }),
  body: z.object({
    name: z.string().min(1, "Product name is required").trim().optional(),
    description: z
      .string()
      .min(1, "Product description is required")
      .trim()
      .optional(),
    price: z.number().positive("Price must be a positive number").optional(),
    categoryId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format")
      .optional(),
  }),
});

export const getProductByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID format"),
  }),
});

export const getProductsSchema = z.object({
  query: z.object({
    categoryId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format")
      .optional(),
  }),
});

export const deleteProductSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID format"),
  }),
});

// Type exports
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetProductByIdInput = z.infer<typeof getProductByIdSchema>;
export type GetProductsInput = z.infer<typeof getProductsSchema>;
export type DeleteProductInput = z.infer<typeof deleteProductSchema>;
