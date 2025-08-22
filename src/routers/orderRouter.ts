import { Router } from "express";
import * as orderController from "../controllers/orders";
import { validate } from "../middleware/validation";
import {
  createOrderSchema,
  updateOrderSchema,
  getOrderByIdSchema,
  deleteOrderSchema,
  getOrderTemplateSchema,
} from "../schemas";

const router = Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders with populated user and product details
 */
router.get("/", orderController.getOrders);

/**
 * @swagger
 * /orders/{id}/template:
 *   get:
 *     summary: Get order template for updating
 *     description: Returns only the editable fields (userId, products) for use in PUT requests.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID (24-character hex string)
 *     responses:
 *       200:
 *         description: Order template with only editable fields
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Order not found
 */
router.get("/:id/template", validate(getOrderTemplateSchema), orderController.getOrderTemplate);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID (24-character hex string)
 *     responses:
 *       200:
 *         description: Order found with populated details
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Order not found
 */
router.get("/:id", validate(getOrderByIdSchema), orderController.getOrderById);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - products
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID (24-character hex string)
 *               products:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: Product ID (24-character hex string)
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       description: Quantity of the product
 *           example:
 *             userId: "68a2e09547100dc49124f1d9"
 *             products:
 *               - productId: "68a2e09547100dc49124f1da"
 *                 quantity: 2
 *               - productId: "68a2e09547100dc49124f1db"
 *                 quantity: 1
 *     responses:
 *       201:
 *         description: Order created with calculated total
 *       400:
 *         description: Validation error, user not found, or product not found
 */
router.post("/", validate(createOrderSchema), orderController.createOrder);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update order
 *     description: |
 *       **WORKFLOW:**
 *       1. First call `GET /orders/{id}/template` to get the current editable structure
 *       2. Modify the returned data as needed
 *       3. Send the modified data in this PUT request
 *       
 *       **Note:** The `total` will be automatically recalculated based on current product prices.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID (24-character hex string)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID (24-character hex string)
 *               products:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: Product ID (24-character hex string)
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       description: Quantity of the product
 *           example:
 *             products:
 *               - productId: "68a2e09547100dc49124f1da"
 *                 quantity: 3
 *     responses:
 *       200:
 *         description: Order updated with recalculated total
 *       400:
 *         description: Invalid ID format, validation error, or product not found
 *       404:
 *         description: Order not found
 */
router.put("/:id", validate(updateOrderSchema), orderController.updateOrder);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID (24-character hex string)
 *     responses:
 *       204:
 *         description: Order deleted
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Order not found
 */
router.delete("/:id", validate(deleteOrderSchema), orderController.deleteOrder);

export default router;
