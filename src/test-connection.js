// test-connection.js

import sequelize from './config/database.js';
const config = require('./config/sequelize-config.js').development;

//const sequelize = new Sequelize(config);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection successful!');

    const [results] = await sequelize.query('SELECT NOW()');
    console.log('Database time:', results[0].now);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await sequelize.close();
  }
})();
