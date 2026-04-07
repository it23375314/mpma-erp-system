import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.MYSQL_URI || 'mysql://root:@localhost:3306/mpma_erp', {
  dialect: 'mysql',
  logging: false, // Set to console.log to see SQL queries
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connected successfully.');
    // Synchronize all models
    await sequelize.sync({ alter: true });
    console.log('MySQL Database synchronized.');
  } catch (error: any) {
    console.error(`Error connecting to MySQL: ${error.message}`);
    process.exit(1);
  }
};

export { sequelize, DataTypes, Model, Optional };
export default connectDB;
