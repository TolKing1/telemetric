import { TelegramClient } from 'telegram';
import * as fs from 'fs';
import logger from './logger';

export class SessionManager {
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