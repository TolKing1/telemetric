import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { config } from './config';
import { registerHandlers } from './handler';
import logger from './utils/logger';
import { ConfigValidator } from './utils/configValidator';
import { SessionManager } from './utils/sessionManager';
import { UserPrompter } from './utils/userPrompter';
import bigInt from 'big-integer';

// Initialize client as a constant
export const client: TelegramClient = new TelegramClient(
  new StringSession(config.sessionString),
  config.apiId,
  config.apiHash,
  { connectionRetries: 5 }
);

export let me: bigInt.BigInteger = bigInt(0);

export async function initializeClient(): Promise<TelegramClient> {
  try {
    ConfigValidator.validate(config);

    await client.start({
      phoneNumber: async () => await UserPrompter.prompt("Please enter your number: "),
      password: async () => await UserPrompter.promptPassword("Please enter your password: "),
      phoneCode: async () => await UserPrompter.prompt("Please enter the code you received: "),
      onError: (err) => { logger.error(`Client error: ${err.message}`); },
    });

    if (!config.sessionString) {
      SessionManager.saveSession(client, config.sessionString);
      logger.info('Session string saved.');
    }
    logger.info('You are now connected.');

    me = (await client.getMe()).id;

    registerHandlers(client);

    return client;
  } catch (error) {
    logger.error(`Failed to create client: ${(error as Error).message}`);
    throw error;
  }
}