import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { config } from './config';
import { registerHandlers } from './handler'; // Ensure the correct path
import logger from './utils/logger';
import * as readline from 'readline';
import * as fs from 'fs';

export async function createClient() {
  try {
    ConfigValidator.validate(config);

    const client = new TelegramClient(
      new StringSession(config.sessionString),
      config.apiId,
      config.apiHash,
      { connectionRetries: 5 }
    );

    await client.start({
      phoneNumber: async () => await UserPrompter.prompt("Please enter your number: "),
      password: async () => await UserPrompter.promptPassword("Please enter your password: "),
      phoneCode: async () => await UserPrompter.prompt("Please enter the code you received: "),
      onError: (err) => { logger.error(`Client error: ${err.message}`); },
    });

    logger.info('You are now connected.');

    SessionManager.saveSession(client, config.sessionString);

    registerHandlers(client);

    return client;
  } catch (error) {
    logger.error(`Failed to create client: ${(error as Error).message}`);
    throw error;
  }
}

class ConfigValidator {
  static validate(config: any) {
    if (!config.apiId || !config.apiHash) {
      throw new Error('API ID and Hash must be set in the configuration.');
    }
  }
}

class SessionManager {
  static saveSession(client: TelegramClient, sessionString: string) {
    if (!sessionString) {
      const newSessionString = client.session.save();
      const envContent = fs.readFileSync('.env', 'utf-8');
      const updatedEnvContent = envContent.includes('TELEGRAM_SESSION')
        ? envContent.replace(/TELEGRAM_SESSION=.*/, `TELEGRAM_SESSION=${newSessionString}`)
        : `${envContent}\nTELEGRAM_SESSION=${newSessionString}\n`;

      fs.writeFileSync('.env', updatedEnvContent, 'utf-8');
      logger.info('Session string saved to .env file.');
    }
  }
}

class UserPrompter {
  static prompt(query: string): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise<string>((resolve: (value: string) => void) => rl.question(query, (ans: string) => {
      rl.close();
      resolve(ans);
    }));
  }

  static promptPassword(query: string): Promise<string> {
    process.stdout.write(query);

    const rl: readline.Interface = readline.createInterface({
      input: process.stdin,
      output: new (require('stream').Writable)({
        write: (chunk: any, encoding: string, callback: () => void) => {
          process.stdout.write("*");
          callback();
        }
      }),
      terminal: true
    });

    return new Promise<string>((resolve) => rl.question('', (ans: string) => {
      rl.close();
      console.log();
      resolve(ans);
    }));
  }
}
