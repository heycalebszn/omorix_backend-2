import dotenv from 'dotenv';
import app from './app.js';
import sequelize from './config/database.js';
import logger from './utils/logger.js';
import https from 'https';
import cron from 'node-cron';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.sync();
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server due to database connection error:', error);
    process.exit(1);
  }
}

function keepAlive(url) {
  https
    .get(url, (res) => {
      logger.info(`Status: ${res.statusCode}`);
    })
    .on('error', (error) => {
      console.error(`Error: ${error.message}`);
    });
}

// Schedule a job to keep the server alive
cron.schedule('*/5 * * * *', () => {
  keepAlive('https://omorix-backend-2.onrender.com');
  logger.info('Pinged the server every 5 minutes');
});

startServer();
