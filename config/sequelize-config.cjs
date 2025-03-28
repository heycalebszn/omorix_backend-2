// // config/sequelize-config.js
// import dotenv from 'dotenv';

// dotenv.config();

// export default {
//   development: {
//     username: process.env.DB_USERNAME || 'postgres',
//     password: process.env.DB_PASSWORD || 'password',
//     database: process.env.DB_NAME || 'omorix_dev',
//     host: process.env.DB_HOST || '127.0.0.1',
//     dialect: 'postgres',
//     logging: false,
//   },
//   test: {
//     username: process.env.DB_USERNAME || 'postgres',
//     password: process.env.DB_PASSWORD || 'password',
//     database: process.env.DB_NAME_TEST || 'omorix_test',
//     host: process.env.DB_HOST || '127.0.0.1',
//     dialect: 'postgres',
//     logging: false,
//   },
//   production: {
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     dialect: 'postgres',
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//     logging: false,
//   },
// };

// config/sequelize-config.js
// import dotenv from 'dotenv';

// dotenv.config();

// module.exports = {
//   development: {
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: 'postgres',
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//     logging: console.log,
//   },
//   // Keep test and production similar but with their own env vars
// };

// config/sequelize-config.cjs
// require('dotenv').config();

// module.exports = {
//   development: {
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: 'postgres',
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//     logging: console.log,
//   },
//   // other environments...
// };

// config/sequelize-config.cjs
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres', // This was missing and causing the dialect error
    dialectOptions: {
      ssl:
        process.env.NODE_ENV === 'production'
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
    },
    logging: console.log,
  },
  test: {
    // your test environment config
  },
  production: {
    // your production config
  },
};
