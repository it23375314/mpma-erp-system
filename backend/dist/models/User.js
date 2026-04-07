"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const db_1 = require("../config/db");
class User extends db_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: db_1.DataTypes.UUID,
        defaultValue: db_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: db_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: db_1.DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: db_1.DataTypes.ENUM('admin', 'user', 'officer'),
        defaultValue: 'user',
    },
}, {
    sequelize: db_1.sequelize,
    tableName: 'users',
});
