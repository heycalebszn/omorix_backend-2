import https from 'https';
import cron from 'node-cron';

// Logger (if not already defined)
const logger = console;

function keepAlive(url) {
  https
    .get(url, (res) => {
      logger.info(`Status: ${res.statusCode}`);
    })
    .on('error', (error) => {
      logger.error(`Error: ${error.message}`);
    });
}

// Schedule a job to keep the server alive every 5 minutes
cron.schedule('*/5 * * * *', () => {
  keepAlive('https://your-render-app-url.onrender.com');
  logger.info('Pinged the server every 5 minutes');
});

logger.info('Keep-alive job scheduled.');
