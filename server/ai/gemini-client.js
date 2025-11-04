const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiClient {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.GEMINI_API_KEY;
    
    if (!this.apiKey) {
      throw new Error('Gemini API key not found. Set GEMINI_API_KEY env variable.');
    }
    
    this.ai = new GoogleGenerativeAI(this.apiKey);
    this.modelName = config.modelName || 'gemini-2.5-flash';
    
    this.model = this.ai.getGenerativeModel({
      model: `gemini-2.5-flash`,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE',
        }
      ]
    });
    
    this.requestCount = 0;
    this.lastRequestTime = 0;
    this.minRequestInterval = 1000;
    this.cache = new Map();
  }

  async generate(prompt, options = {}) {
    // Rate limiting
    await this.waitForRateLimit();
    
    // Check cache
    if (options.cache !== false) {
      const cached = this.getFromCache(prompt);
      if (cached) {
        console.log('✓ Using cached AI response');
        return cached;
      }
    }
    
    // Generate with retry
    for (let attempt = 1; attempt <= 3; attempt++) {
      let modelToUse = this.modelName; // Default to primary model


      try {
        console.log(`AI request attempt ${attempt}/3 with model: ${modelToUse}`);

        // Dynamically get the generative model instance for each attempt
        const currentGenerativeModel = this.ai.getGenerativeModel({
          model: modelToUse,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_NONE',
            }
          ]
        });

        const result = await currentGenerativeModel.generateContent(prompt);
        const response = result.response.text();
        
        this.requestCount++;
        
        if (options.cache !== false) {
          this.setCache(prompt, response);
        }
        
        return response;
        
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        
        if (error.message.includes('quota') || error.message.includes('429')) {
          throw new Error('Gemini API quota exceeded. Try again in 1 minute.');
        }
        
        if (attempt < 3) {
          await this.sleep(2000 * attempt);
        }
      }
    }
    
    throw new Error(`AI generation failed after 3 attempts`);
  }

  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      console.log(`Rate limit: waiting ${waitTime}ms`);
      await this.sleep(waitTime);
    }
    
    this.lastRequestTime = Date.now();
  }

  getFromCache(key) {
    const hash = this.hashString(key);
    const cached = this.cache.get(hash);
    
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > 3600000) {
      this.cache.delete(hash);
      return null;
    }
    
    return cached.data;
  }

  setCache(key, data) {
    const hash = this.hashString(key);
    this.cache.set(hash, {
      data,
      timestamp: Date.now()
    });
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStats() {
    return {
      requestCount: this.requestCount,
      cacheSize: this.cache.size
    };
  }
}

module.exports = GeminiClient;
