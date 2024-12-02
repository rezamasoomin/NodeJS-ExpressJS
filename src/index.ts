import { createApp } from './app';
import { initializeDatabase } from './config/database';
import env from './config/env';
import logger from './libraries/logger';

async function bootstrap() {
  try {
    // Initialize database
    await initializeDatabase();

    // Create and start application
    const app = await createApp();
    
    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    // Graceful shutdown
    const signals = ['SIGTERM', 'SIGINT'];
    signals.forEach(signal => {
      process.on(signal, async () => {
        logger.info(`${signal} received, shutting down...`);
        // Add cleanup logic here
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
}

bootstrap();