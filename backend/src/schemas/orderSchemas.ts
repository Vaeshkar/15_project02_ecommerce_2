import { z } from "zod";

// Order validation schemas
export const createOrderSchema = z.object({
  body: z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
    products: z
      .array(
        z.object({
          productId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID format"),
          quantity: z
            .number()
            .int()
            .positive("Quantity must be a positive integer"),
        })
      )
      .min(1, "At least one product is required"),
  }),
});

export const updateOrderSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid order ID format"),
  }),
  body: z.object({
    userId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format")
      .optional(),
    products: z
      .array(
        z.object({
          productId: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID format"),
          quantity: z
            .number()
            .int()
            .positive("Quantity must be a positive integer"),
        })
      )
      .min(1, "At least one product is required")
      .optional(),
  }),
});

export const getOrderByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid order ID format"),
  }),
});

export const deleteOrderSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid order ID format"),
  }),
});

// Type exports
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type GetOrderByIdInput = z.infer<typeof getOrderByIdSchema>;
export type DeleteOrderInput = z.infer<typeof deleteOrderSchema>;

export const getOrderTemplateSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid order ID format"),
  }),
});

export type GetOrderTemplateInput = z.infer<typeof getOrderTemplateSchema>;
