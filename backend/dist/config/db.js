"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = exports.DataTypes = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "DataTypes", { enumerable: true, get: function () { return sequelize_1.DataTypes; } });
Object.defineProperty(exports, "Model", { enumerable: true, get: function () { return sequelize_1.Model; } });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize("myproject", // database
"root", // user
"", // password (EMPTY)
{
    host: "localhost",
    dialect: "mysql",
    logging: false,
});
exports.sequelize = sequelize;
console.log("Connecting with password:", "");
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log('MySQL Connected successfully.');
        // Synchronize all models
        // await sequelize.sync({ alter: true });
        console.log('MySQL Database synchronized.');
    }
    catch (error) {
        console.error(`Error connecting to MySQL: ${error.message}`);
        process.exit(1);
    }
});
exports.default = connectDB;
