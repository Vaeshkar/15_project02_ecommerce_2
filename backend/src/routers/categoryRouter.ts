import { Router } from "express";
import * as categoryController from "../controllers/categories";
import { validate } from "../middleware/validation";
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoryByIdSchema,
  deleteCategorySchema,
} from "../schemas";

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", categoryController.getCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID (24-character hex string)
 *     responses:
 *       200:
 *         description: Category found
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Category not found
 */
router.get(
  "/:id",
  validate(getCategoryByIdSchema),
  categoryController.getCategoryById
);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 description: Category name
 *           example:
 *             name: "Electronics"
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Validation error
 */
router.post(
  "/",
  validate(createCategorySchema),
  categoryController.createCategory
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID (24-character hex string)
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
 *                 description: Category name
 *           example:
 *             name: "Home & Garden"
 *     responses:
 *       200:
 *         description: Category updated
 *       400:
 *         description: Invalid ID format or validation error
 *       404:
 *         description: Category not found
 */
router.put(
  "/:id",
  validate(updateCategorySchema),
  categoryController.updateCategory
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID (24-character hex string)
 *     responses:
 *       204:
 *         description: Category deleted
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Category not found
 */
router.delete(
  "/:id",
  validate(deleteCategorySchema),
  categoryController.deleteCategory
);

export default router;
