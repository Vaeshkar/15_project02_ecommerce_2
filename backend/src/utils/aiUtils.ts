import axios from 'axios';
import NodeCache from 'node-cache';

// Cache for 1 hour (3600 seconds)
const imageCache = new NodeCache({ stdTTL: 3600 });

// Rate limiting - minimum delay between API calls
let lastApiCall = 0;
const MIN_DELAY = 1000; // 1 second between calls

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_IMAGE = 'https://api.openai.com/v1/images/generations';

interface ImageGenerationOptions {
  model?: 'dall-e-3' | 'dall-e-2';
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  maxRetries?: number;
  useCache?: boolean;
}

interface ImageGenerationResult {
  imageUrl: string;
  revisedPrompt?: string;
  fromCache: boolean;
  attempts: number;
}

/**
 * Sleep for a specified number of milliseconds
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Create a cache key from the prompt and options
 */
const createCacheKey = (prompt: string, options: ImageGenerationOptions): string => {
  const { model = 'dall-e-3', size = '1024x1024', quality = 'standard', style = 'vivid' } = options;
  return `image_${model}_${size}_${quality}_${style}_${prompt.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50)}`;
};

/**
 * Rate-limited function to ensure we don't hit API limits
 */
const enforceRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;
  
  if (timeSinceLastCall < MIN_DELAY) {
    const waitTime = MIN_DELAY - timeSinceLastCall;
    console.log(`Rate limiting: waiting ${waitTime}ms before next API call`);
    await sleep(waitTime);
  }
  
  lastApiCall = Date.now();
};

/**
 * Generate an image using OpenAI DALL-E with retry logic and caching
 */
export async function generateProductImage(
  prompt: string,
  options: ImageGenerationOptions = {}
): Promise<ImageGenerationResult> {
  if (!prompt) {
    throw new Error('Prompt is required', { cause: { status: 400 } });
  }

  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured', { cause: { status: 500 } });
  }

  const {
    model = 'dall-e-3',
    size = '1024x1024',
    quality = 'standard',
    style = 'vivid',
    maxRetries = 3,
    useCache = true
  } = options;

  // Check cache first if enabled
  if (useCache) {
    const cacheKey = createCacheKey(prompt, options);
    const cached = imageCache.get<ImageGenerationResult>(cacheKey);
    
    if (cached) {
      console.log('Using cached image for prompt:', prompt.substring(0, 50) + '...');
      return {
        ...cached,
        fromCache: true,
        attempts: 0
      };
    }
  }

  let lastError: any;
  
  // Retry logic
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Generating image (attempt ${attempt}/${maxRetries}):`, prompt.substring(0, 50) + '...');
      
      // Enforce rate limiting
      await enforceRateLimit();

      const requestBody: any = {
        model,
        prompt,
        n: 1,
        size,
        response_format: 'url'
      };

      // Add DALL-E 3 specific options
      if (model === 'dall-e-3') {
        requestBody.quality = quality;
        requestBody.style = style;
      }

      const response = await axios.post(
        OPENAI_API_IMAGE,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000, // 60 second timeout
        }
      );

      const imageUrl = response.data.data[0].url;
      const revisedPrompt = response.data.data[0].revised_prompt;

      const result: ImageGenerationResult = {
        imageUrl,
        revisedPrompt,
        fromCache: false,
        attempts: attempt
      };

      // Cache the successful result if caching is enabled
      if (useCache) {
        const cacheKey = createCacheKey(prompt, options);
        imageCache.set(cacheKey, result);
        console.log('Cached image result for future use');
      }

      console.log(`Image generated successfully on attempt ${attempt}`);
      return result;

    } catch (error: any) {
      lastError = error;
      const errorMessage = error.response?.data?.error?.message || error.message;
      
      console.log(`Attempt ${attempt} failed:`, errorMessage);
      
      // If it's the last attempt, don't wait
      if (attempt === maxRetries) {
        break;
      }
      
      // Exponential backoff: wait longer between retries
      const backoffDelay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s...
      console.log(`Waiting ${backoffDelay}ms before retry...`);
      await sleep(backoffDelay);
    }
  }

  // If we get here, all attempts failed
  console.error(`All ${maxRetries} attempts failed for image generation`);
  const errorMessage = lastError?.response?.data?.error?.message || lastError?.message || 'Unknown error';
  throw new Error(`Failed to generate image after ${maxRetries} attempts: ${errorMessage}`, { 
    cause: { status: 500 } 
  });
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const stats = imageCache.getStats();
  return {
    keys: stats.keys,
    hits: stats.hits,
    misses: stats.misses,
    hitRate: stats.hits / (stats.hits + stats.misses) || 0,
    vsize: stats.vsize
  };
}

/**
 * Clear the image cache
 */
export function clearCache(): void {
  imageCache.flushAll();
  console.log('Image cache cleared');
}

/**
 * Get cached items count
 */
export function getCacheSize(): number {
  return imageCache.keys().length;
}
