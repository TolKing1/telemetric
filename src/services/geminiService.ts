import {
    GenerativeModel,
    GoogleGenerativeAI,
    GenerateContentRequest,
    GenerateContentResult,
    Content,
    GenerationConfig
} from "@google/generative-ai";
import logger from "../utils/logger";

export class GeminiService {
  private static instance: GeminiService;
  private model: GenerativeModel;

  private constructor() {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  public static getInstance(): GeminiService {
      if (!GeminiService.instance) {
          GeminiService.instance = new GeminiService();
      }
      return GeminiService.instance;
  }

    async generateContent(prompt: string, maxOutputTokens?: number): Promise<string> {
        const request: GenerateContentRequest = {
            contents: [{
                role: "user",
                parts: [{ text: prompt }],
            }] as Content[],
            generationConfig: this.getGenerationConfig(maxOutputTokens)
        };
        const result: GenerateContentResult = await this.model.generateContent(request);
        const textResponse = result.response?.text();
        if (textResponse) {
            logger.debug(`Generated content: ${textResponse}`);
            return textResponse;
        }
        return "No response from Gemini API";
    }

    private getGenerationConfig(maxOutputTokens?: number): GenerationConfig | undefined {
      if (!maxOutputTokens) {
        return undefined
      }
        return {
          maxOutputTokens: maxOutputTokens
        }
    }

    async translate(text: string, language:String): Promise<string> {
        const prompt = `Translate the following text(auto-detect it):"""${text}""" into ${language} and provide only the translation`;
        const request: GenerateContentRequest = {
          contents: [{
            role: "user",
            parts: [{ text: prompt }],
          }] as Content[],
          generationConfig: this.getGenerationConfig(500)
        };

      const result: GenerateContentResult = await this.model.generateContent(request);
      const textResponse = result.response?.text();

      if (textResponse) {
        return textResponse.trim();
      }
      return "Translation failed.";
    }
}