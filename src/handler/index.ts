import { TelegramClient } from 'telegram';
import { NewMessage } from 'telegram/events';
import { handleMessage } from './message/index';

export function registerHandlers(client: TelegramClient) {
  client.addEventHandler(handleMessage, new NewMessage({}));
}