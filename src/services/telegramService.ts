import { Api } from 'telegram';
import { EntityLike } from 'telegram/define';
import bigInt from 'big-integer';
import logger from '../utils/logger';
import { client } from '../client';

export class TelegramService {
    private static instance: TelegramService;

    public static getInstance(): TelegramService {
        if (!TelegramService.instance) {
            TelegramService.instance = new TelegramService();
        }
        return TelegramService.instance;
    }

    async sendMessage(chatId: EntityLike, text: string) {
        try {
            await client.sendMessage(chatId, { message: text });
            logger.info(`Message sent to chat ${chatId}: ${text}`);
        } catch (error) {
            logger.error(`Failed to send message to chat ${chatId}: ${(error as Error).message}`);
        }
    }

    async editMessage(chatId: bigInt.BigInteger, messageId: number, text: string) {
        try {
            await client.editMessage(chatId, { message: messageId, text: text });
            logger.debug(`Message edited for ${messageId}: ${text}`);
        } catch (error) {
            logger.error(`Failed to edit message in chat ${messageId}: ${(error as Error).message}`);
        }
    }

    async getMessage(messageId: number) {
        try {
            const message = (await client.getMessages(messageId)).at(0);
            logger.debug(`Message fetched for ${messageId}: ${message}`);
            return message;
        } catch (error) {
            logger.error(`Failed to fetch message for ${messageId}: ${(error as Error).message}`);
            throw error;
        }
    }

    async deleteMessage(chatId: bigInt.BigInteger, messageId: number) {
        try {
            await client.deleteMessages(chatId, [messageId], {revoke: true});
            logger.info(`Message deleted in chat ${chatId} with message ID ${messageId}`);
        } catch (error) {
            logger.error(`Failed to delete message in chat ${chatId} with message ID ${messageId}: ${(error as Error).message}`);
        }
    }

    async getReplyMessage(message: Api.Message): Promise<Api.Message> {
        const replyMessage: Api.Message | undefined = await message.getReplyMessage();
        if (replyMessage) {
            logger.info(`Reply message fetched: ${replyMessage}`);
            return replyMessage;
        } else {
            logger.warn(`No reply message found for message ID ${message.id}`);
            throw new Error(`No reply message found for message ID ${message.id}`);
        }
    }

    logMessage(chatType: string, chatName: string, senderName: string, messageText: string): void {
      switch (chatType) {
        case 'Channel':
          logger.debug(`📺 Message from "${chatName}" by "${senderName}": ${messageText}`);
          break;
        case 'Group':
          logger.debug(`👥 Message from "${chatName}" by ${senderName}: ${messageText}`);
          break;
        case 'Private':
          logger.debug(`🔒 Message from "${senderName}": ${messageText}`);
          break;
        default:
          logger.debug(`Received from ${chatType} "${chatName}" by "${senderName}": ${messageText}`);
      }
    }
    
}