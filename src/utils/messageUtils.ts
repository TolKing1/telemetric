import { Api } from "telegram";
import logger from "./logger";

// Define a type for sender
export type Sender = Api.User | Api.Channel | Api.Chat;

// Define a type for chat
export type Chat = Api.Chat | Api.Channel | Api.User;

// Utility function to determine sender name
export function getSenderName(sender: Sender): string {
  if (sender instanceof Api.User) {
    return sender.username || sender.firstName || 'Unknown User';
  } else if (sender instanceof Api.Channel) {
    return sender.title || 'Unknown Channel';
  } else if (sender instanceof Api.Chat) {
    return sender.title || 'Unknown Chat';
  }
  return 'Unknown';
}

// Utility function to determine chat name and type
export function getChatDetails(chat: Chat, senderName: string): { name: string; type: string } {
  if (chat instanceof Api.Chat) {
    return { name: chat.title || 'Private Chat', type: 'Group' };
  } else if (chat instanceof Api.Channel) {
    return { name: chat.title || 'Channel', type: 'Channel' };
  } else if (chat instanceof Api.User) {
    return { name: senderName, type: 'Private' };
  }
  return { name: 'Unknown Chat', type: 'Unknown Type' };
}

// Utility function for logging
export function logMessage(chatType: string, chatName: string, senderName: string, messageText: string): void {
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