import { Router } from "express";
import { verifyToken } from "../middleware/auth";
import Product from "../models/Product";
import { generateProductImage, getCacheStats, clearCache, getCacheSize } from "../utils/aiUtils";

const router = Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * @swagger
 * /ai/generate-product-image:
 *   post:
 *     summary: Generate AI image for a product using DALL-E 3 with retry logic and caching
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               prompt:
 *                 type: string
 *                 description: Custom prompt or auto-generate from product
 *               options:
 *                 type: object
 *                 properties:
 *                   model:
 *                     type: string
 *                     enum: [dall-e-3, dall-e-2]
 *                     default: dall-e-3
 *                   size:
 *                     type: string
 *                     enum: [256x256, 512x512, 1024x1024, 1792x1024, 1024x1792]
 *                     default: 1024x1024
 *                   quality:
 *                     type: string
 *                     enum: [standard, hd]
 *                     default: standard
 *                   style:
 *                     type: string
 *                     enum: [vivid, natural]
 *                     default: vivid
 *                   maxRetries:
 *                     type: number
 *                     default: 3
 *                   useCache:
 *                     type: boolean
 *                     default: true
 *     responses:
 *       200:
 *         description: Image generated successfully
 */
router.post("/generate-product-image", verifyToken, async (req, res) => {
  try {
    const { productId, prompt: customPrompt, options = {} } = req.body;

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ 
        message: "OpenAI API key not configured",
        error: "Server configuration error"
      });
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Generate prompt from product or use custom prompt
    const prompt = customPrompt || 
      `Professional product photography of ${product.name}, ${product.description}, white background, high quality, e-commerce style, studio lighting, commercial photo`;

    console.log("Generating image with enhanced AI utils, prompt:", prompt.substring(0, 100) + "...");

    // Use enhanced AI utils with retry logic and caching
    const result = await generateProductImage(prompt, options);

    res.json({
      message: "Image generated successfully with enhanced AI utils",
      imageUrl: result.imageUrl,
      prompt: prompt,
      revisedPrompt: result.revisedPrompt,
      productId: productId,
      metadata: {
        fromCache: result.fromCache,
        attempts: result.attempts,
        model: options.model || 'dall-e-3',
        size: options.size || '1024x1024',
        quality: options.quality || 'standard',
        style: options.style || 'vivid'
      }
    });

  } catch (error: any) {
    console.error("Error generating image with enhanced AI utils:", error.message);
    
    const statusCode = error.cause?.status || 500;
    const errorMessage = error.message || "Unknown error";
    
    res.status(statusCode).json({ 
      message: "Failed to generate image", 
      error: errorMessage,
      service: "Enhanced OpenAI DALL-E 3 with retry & caching"
    });
  }
});

/**
 * @swagger
 * /ai/cache/stats:
 *   get:
 *     summary: Get cache statistics
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cache statistics
 */
router.get("/cache/stats", verifyToken, async (req, res) => {
  try {
    const stats = getCacheStats();
    const cacheSize = getCacheSize();
    
    res.json({
      message: "Cache statistics",
      stats: {
        ...stats,
        cacheSize,
        hitRatePercentage: Math.round(stats.hitRate * 100)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to get cache statistics",
      error: error.message
    });
  }
});

/**
 * @swagger
 * /ai/cache/clear:
 *   delete:
 *     summary: Clear the image cache
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 */
router.delete("/cache/clear", verifyToken, async (req, res) => {
  try {
    clearCache();
    res.json({
      message: "Image cache cleared successfully"
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to clear cache",
      error: error.message
    });
  }
});

/**
 * @swagger
 * /ai/test:
 *   get:
 *     summary: Test AI service (OpenAI) with enhanced features
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: AI service is working
 */
router.get("/test", async (req, res) => {
  try {
    const hasApiKey = !!OPENAI_API_KEY;
    const apiKeyPrefix = OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 10) + "..." : "not found";
    const cacheStats = getCacheStats();
    const cacheSize = getCacheSize();
    
    res.json({ 
      message: "Enhanced AI service test - OpenAI DALL-E 3 with retry logic and caching",
      hasApiKey: hasApiKey,
      apiKeyPrefix: apiKeyPrefix,
      service: "Enhanced OpenAI",
      features: [
        "Retry logic with exponential backoff",
        "Response caching (1 hour TTL)",
        "Rate limiting",
        "Configurable options",
        "Cache statistics"
      ],
      cacheInfo: {
        size: cacheSize,
        hitRate: Math.round(cacheStats.hitRate * 100) + "%",
        totalRequests: cacheStats.hits + cacheStats.misses
      },
      isWorking: hasApiKey
    });
  } catch (error: any) {
    res.json({ 
      message: "Enhanced AI service test failed",
      hasApiKey: !!OPENAI_API_KEY,
      error: error.message,
      service: "Enhanced OpenAI"
    });
  }
});

export default router;
