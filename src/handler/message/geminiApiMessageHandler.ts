import { NewMessageEvent } from 'telegram/events';
import { GeminiService } from '../../services/geminiService';
import { TelegramService } from '../../services/telegramService';
import logger from '../../utils/logger';
import { checkIfSenderIsMe } from '../../utils/messageUtils';
import { Api } from 'telegram';
import bigInt from 'big-integer';

const geminiService = GeminiService.getInstance();
const telegramService = TelegramService.getInstance();

export async function handleGeminiMessage(event: NewMessageEvent): Promise<void> {
    const message = event.message;
    const chatId = event.chatId;
    const messageBody: string = message.text;
    const messageId = message.id;

    if (!checkIfSenderIsMe(message)) return;

    if (!chatId) {
        logger.error(`Failed to edit message: ${messageId}: ChatId is not available`);
        return;
    }

    try {
        if (messageBody.startsWith("pr ")) {
            await handlePromptRequest(chatId, messageId, messageBody);
        } else if (messageBody.startsWith("tr ")) {
            await handleTranslateRequest(chatId, messageId, message, messageBody);
        }
    } catch (error) {
        logger.error(`Error handling message ${messageId}: ${(error as Error).message}`);
    }
}

async function handlePromptRequest(chatId: bigInt.BigInteger, messageId: number, messageBody: string): Promise<void> {
    logger.info(`Received prompt request from chat ${chatId}`);
    
    try {
        const response = await geminiService.generateContent(messageBody.substring(3));
        await telegramService.editMessage(chatId, messageId, response);
    } catch (error) {
        logger.error(`Failed to handle prompt request for message ${messageId}: ${(error as Error).message}`);
    }
}

async function handleTranslateRequest(chatId: bigInt.BigInteger, messageId: number, message: Api.Message, messageBody: string): Promise<void> {
    logger.info(`Received translate request from chat ${chatId}`);
    
    try {
        const language = messageBody.substring(3);

        await telegramService.deleteMessage(chatId, messageId);

        const replyMsg = await telegramService.getReplyMessage(message);
        const replyMessageText: string = replyMsg.text;
        const response = await geminiService.translate(replyMessageText, language);
        await telegramService.sendMessage("me", response);
    } catch (error) {
        logger.error(`Failed to handle translate request for message ${messageId}: ${(error as Error).message}`);
    }
}