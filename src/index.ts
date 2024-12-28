import { createClient } from './client';
import logger from './utils/logger';

async function main() {
  try {
    await createClient();
    logger.info('Client started successfully...');
  } catch (error) {
    logger.error(`Failed to start client: ${(error as Error).message}`);
  }
}

main();