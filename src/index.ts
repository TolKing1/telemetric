
import { initializeClient } from './client';
import logger from './utils/logger';

async function main() {
  try {
    await initializeClient();
    logger.info('Client started successfully...');
  } catch (error) {
    logger.error(`Failed to start client: ${(error as Error).message}`);
  }
}

main();