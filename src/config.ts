import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  apiId: parseInt(process.env.TELEGRAM_API_ID || '', 10),
  apiHash: process.env.TELEGRAM_API_HASH || '',
  sessionString: process.env.TELEGRAM_SESSION || '',
};