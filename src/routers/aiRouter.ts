import { Router } from "express";
import { verifyToken } from "../middleware/auth";
import Product from "../models/Product";
import axios from "axios";

const router = Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_IMAGE = 'https://api.openai.com/v1/images/generations';

/**
 * @swagger
 * /ai/generate-product-image:
 *   post:
 *     summary: Generate AI image for a product using DALL-E 3
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
 *     responses:
 *       200:
 *         description: Image generated successfully
 */
router.post("/generate-product-image", verifyToken, async (req, res) => {
  try {
    const { productId, prompt: customPrompt } = req.body;

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

    console.log("Generating image with DALL-E 3, prompt:", prompt);

    // Call OpenAI DALL-E 3 API
    const response = await axios.post(
      OPENAI_API_IMAGE,
      {
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("DALL-E 3 API Response successful");

    const imageUrl = response.data.data[0].url;
    const revisedPrompt = response.data.data[0].revised_prompt;

    res.json({
      message: "Image generated successfully with DALL-E 3",
      imageUrl: imageUrl,
      prompt: prompt,
      revisedPrompt: revisedPrompt,
      productId: productId,
    });

  } catch (error: any) {
    console.error("Error generating image with DALL-E 3:", error.response?.data || error.message);
    
    const errorMessage = error.response?.data?.error?.message || error.message || "Unknown error";
    
    res.status(500).json({ 
      message: "Failed to generate image", 
      error: errorMessage,
      service: "OpenAI DALL-E 3"
    });
  }
});

/**
 * @swagger
 * /ai/test:
 *   get:
 *     summary: Test AI service (OpenAI)
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: AI service is working
 */
router.get("/test", async (req, res) => {
  try {
    const hasApiKey = !!OPENAI_API_KEY;
    const apiKeyPrefix = OPENAI_API_KEY ? OPENAI_API_KEY.substring(0, 10) + "..." : "not found";
    
    res.json({ 
      message: "AI service test - OpenAI DALL-E 3",
      hasApiKey: hasApiKey,
      apiKeyPrefix: apiKeyPrefix,
      service: "OpenAI",
      isWorking: hasApiKey
    });
  } catch (error: any) {
    res.json({ 
      message: "AI service test failed",
      hasApiKey: !!OPENAI_API_KEY,
      error: error.message,
      service: "OpenAI"
    });
  }
});

export default router;
