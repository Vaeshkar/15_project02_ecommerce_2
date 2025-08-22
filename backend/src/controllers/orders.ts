import { Request, Response, NextFunction } from "express";
import { Order, User, Product } from "../models";
import { CreateOrderInput } from "../schemas";
import { TypedRequest } from "../types";

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId", "name price");
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("products.productId", "name price");
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (
  req: TypedRequest<CreateOrderInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user exists
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Check if all products exist and calculate total
    let total = 0;
    for (const orderProduct of req.body.products) {
      const product = await Product.findById(orderProduct.productId);
      if (!product) {
        return res
          .status(400)
          .json({ error: `Product ${orderProduct.productId} not found` });
      }
      total += product.price * orderProduct.quantity;
    }

    const order = new Order({
      ...req.body,
      total,
    });

    const savedOrder = await order.save();
    await savedOrder.populate("userId", "name email");
    await savedOrder.populate("products.productId", "name price");

    res.status(201).json(savedOrder);
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // If updating products, recalculate total
    if (req.body.products) {
      let total = 0;
      for (const orderProduct of req.body.products) {
        const product = await Product.findById(orderProduct.productId);
        if (!product) {
          return res
            .status(400)
            .json({ error: `Product ${orderProduct.productId} not found` });
        }
        total += product.price * orderProduct.quantity;
      }
      req.body.total = total;
    }

    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("userId", "name email")
      .populate("products.productId", "name price");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getOrderTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    // Return only editable fields for PUT request
    const template = {
      userId: order.userId,
      products: order.products.map(p => ({
        productId: p.productId,
        quantity: p.quantity
      }))
    };
    
    res.json(template);
  } catch (error) {
    next(error);
  }
};
