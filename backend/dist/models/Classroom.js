"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Classroom = void 0;
const db_1 = require("../config/db");
class Classroom extends db_1.Model {
}
exports.Classroom = Classroom;
Classroom.init({
    id: {
        type: db_1.DataTypes.UUID,
        defaultValue: db_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: { type: db_1.DataTypes.STRING, allowNull: false },
    capacity: { type: db_1.DataTypes.INTEGER, allowNull: false },
    location: { type: db_1.DataTypes.STRING, allowNull: false },
    examReady: { type: db_1.DataTypes.STRING, allowNull: false },
    facilities: {
        type: db_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
}, {
    sequelize: db_1.sequelize,
    tableName: 'classrooms',
});
