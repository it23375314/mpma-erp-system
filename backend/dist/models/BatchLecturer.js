"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchLecturer = void 0;
const db_1 = require("../config/db");
class BatchLecturer extends db_1.Model {
}
exports.BatchLecturer = BatchLecturer;
BatchLecturer.init({
    id: {
        type: db_1.DataTypes.UUID,
        defaultValue: db_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    batchId: {
        type: db_1.DataTypes.UUID,
        allowNull: false,
    },
    lecturerId: {
        type: db_1.DataTypes.UUID,
        allowNull: false,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: 'batch_lecturers',
});
exports.default = BatchLecturer;
