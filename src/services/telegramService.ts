import { TelegramClient } from 'telegram';
import logger from '../utils/logger';

export class TelegramService {
  constructor(private client: TelegramClient) {}

  async sendMessage(chatId: number, text: string) {
    try {
      await this.client.sendMessage(chatId, { message: text });
      logger.info(`Message sent to chat ${chatId}: ${text}`);
    } catch (error) {
      logger.error(`Failed to send message to chat ${chatId}: ${(error as Error).message}`);
    }
  }

  // Add more methods for interacting with Telegram
}