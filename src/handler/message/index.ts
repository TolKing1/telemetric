import { NewMessageEvent } from "telegram/events";
import { Chat, getChatDetails, getSenderName, Sender } from "../../utils/messageUtils";
import { handleGeminiMessage } from "./geminiApiMessageHandler";
import { TelegramService } from '../../services/telegramService';

const telegramService = TelegramService.getInstance();

export async function handleMessage(event: NewMessageEvent) {
  const message = event.message;
  const sender = await message.getSender() as Sender;
  const chat = await message.getChat() as Chat;
  const senderName = getSenderName(sender);
  const { name: chatName, type: chatType } = getChatDetails(chat, senderName);

  telegramService.logMessage(chatType, chatName, senderName, message.text || '');
  handleGeminiMessage(event);

}