import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE || "myproject",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

console.log("Connecting to database:", process.env.DB_DATABASE);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connected successfully.');
    // Synchronize all models
    await sequelize.sync();
    console.log('MySQL Database synchronized.');
  } catch (error: any) {
    console.error(`Error connecting to MySQL: ${error.message}`);
    process.exit(1);
  }
};

export { sequelize, DataTypes, Model, Optional };
export default connectDB;
