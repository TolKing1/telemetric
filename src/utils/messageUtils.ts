import { Api} from 'telegram';
import { me } from '../client';

// Define a type for sender
export type Sender = Api.User | Api.Channel | Api.Chat;

// Define a type for chat
export type Chat = Api.Chat | Api.Channel | Api.User;


export function checkIfSenderIsMe(message: Api.Message): boolean {
  if (message.senderId && me) {
    return message.senderId.equals(me);
  }
  return false;
}

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

