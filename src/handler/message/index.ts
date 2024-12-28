import { NewMessageEvent } from "telegram/events";
import { Chat, getChatDetails, getSenderName, logMessage, Sender } from "../../utils/messageUtils";

export async function handleMessage(event: NewMessageEvent) {
  const message = event.message;
  const messageBody = event.message;
  const sender = await message.getSender() as Sender;
  const chat = await message.getChat() as Chat;

  const senderName = getSenderName(sender);
  const { name: chatName, type: chatType } = getChatDetails(chat, senderName);

  logMessage(chatType, chatName, senderName, message.text || '');
  

}