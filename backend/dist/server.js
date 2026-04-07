"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const vehicleRoutes_1 = __importDefault(require("./routes/vehicleRoutes"));
const transportBookingRoutes_1 = __importDefault(require("./routes/transportBookingRoutes"));
const classroomRoutes_1 = __importDefault(require("./routes/classroomRoutes"));
const classroomBookingRoutes_1 = __importDefault(require("./routes/classroomBookingRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const auditoriumBookingRoutes_1 = __importDefault(require("./routes/auditoriumBookingRoutes"));
const maintenanceRoutes_1 = __importDefault(require("./routes/maintenanceRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const Maintenance_1 = __importDefault(require("./models/Maintenance"));
const associations_1 = require("./models/associations");
// Set up model relationships
(0, associations_1.setupAssociations)();
// Load env vars
dotenv_1.default.config();
// Connect to Database
(0, db_1.default)();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Basic Route
app.get('/', (req, res) => {
    res.send('MPMA ERP API is running...');
});
app.use('/api/vehicles', vehicleRoutes_1.default);
app.use('/api/transport-bookings', transportBookingRoutes_1.default);
app.use('/api/classrooms', classroomRoutes_1.default);
app.use('/api/classroom-bookings', classroomBookingRoutes_1.default);
app.use('/api/auditorium-bookings', auditoriumBookingRoutes_1.default);
app.use('/api/maintenances', maintenanceRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
// Sync specific models if not handled by root sync
Maintenance_1.default.sync({ alter: true }).then(() => {
    console.log("Maintenance model synced");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
