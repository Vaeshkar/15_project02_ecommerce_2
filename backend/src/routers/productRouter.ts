import { Router } from "express";
import * as productController from "../controllers/products";
import { validate } from "../middleware/validation";
import {
  createProductSchema,
  updateProductSchema,
  getProductByIdSchema,
  getProductsSchema,
  deleteProductSchema,
} from "../schemas";

const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by category ID (24-character hex string)
 *     responses:
 *       200:
 *         description: List of products
 *       400:
 *         description: Invalid categoryId format
 */
router.get("/", validate(getProductsSchema), productController.getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID (24-character hex string)
 *     responses:
 *       200:
 *         description: Product found
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Product not found
 */
router.get(
  "/:id",
  validate(getProductByIdSchema),
  productController.getProductById
);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 description: Product name
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 description: Product description
 *               price:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Product price (must be positive)
 *               categoryId:
 *                 type: string
 *                 description: Category ID (24-character hex string)
 *           example:
 *             name: "iPhone 15"
 *             description: "Latest smartphone with advanced features"
 *             price: 999.99
 *             categoryId: "68a2e09547100dc49124f1d8"
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error or category not found
 */
router.post(
  "/",
  validate(createProductSchema),
  productController.createProduct
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID (24-character hex string)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 description: Product name
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 description: Product description
 *               price:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Product price (must be positive)
 *               categoryId:
 *                 type: string
 *                 description: Category ID (24-character hex string)
 *           example:
 *             name: "iPhone 15 Pro"
 *             price: 1199.99
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Invalid ID format, validation error, or category not found
 *       404:
 *         description: Product not found
 */
router.put(
  "/:id",
  validate(updateProductSchema),
  productController.updateProduct
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID (24-character hex string)
 *     responses:
 *       204:
 *         description: Product deleted
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Product not found
 */
router.delete(
  "/:id",
  validate(deleteProductSchema),
  productController.deleteProduct
);

export default router;
