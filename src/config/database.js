// import Sequelize from 'sequelize'
// import dotenv from 'dotenv'

// dotenv.config()

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'postgres',
//   logging: process.env.NODE_ENV === 'development' ? console.log : false,
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   },
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false
//     }
//   }
// })

// export default sequelize


// // import Sequelize from 'sequelize';
// // import dotenv from 'dotenv';

// // dotenv.config();

// // const sequelize = new Sequelize(process.env.DATABASE_URL, {
// //   dialect: 'mysql',
// //   host: 'localhost', // Use localhost for TCP or socket resolution
// //   port: 8889, // Explicit port for TCP
// //   dialectOptions: {
// //     socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock' // Fallback to socket if TCP fails
// //   },
// //   logging: process.env.NODE_ENV === 'development' ? console.log : false,
// //   define: {
// //     timestamps: true,
// //     paranoid: true
// //   }
// // });

// // export default sequelize;

import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',  // Changed from postgres to mysql
  host: 'localhost',
  port: 3306,        // Default MySQL port for XAMPP
  username: 'root',  // Explicitly set credentials
  password: '',
  database: 'glamorix_db',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    // XAMPP's MariaDB doesn't support SSL by default
    ssl: false,      // Explicitly disable SSL
    // For older MariaDB versions if needed
    insecureAuth: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    paranoid: true
  }
});

export default sequelize;