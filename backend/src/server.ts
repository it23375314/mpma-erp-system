import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import vehicleRoutes from './routes/vehicleRoutes';
import transportBookingRoutes from './routes/transportBookingRoutes';
import classroomRoutes from './routes/classroomRoutes';
import classroomBookingRoutes from './routes/classroomBookingRoutes';
import authRoutes from './routes/authRoutes';
import auditoriumBookingRoutes from './routes/auditoriumBookingRoutes';
import maintenanceRoutes from './routes/maintenanceRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import Maintenance from './models/Maintenance';
import { setupAssociations } from './models/associations';

// Set up model relationships
setupAssociations();

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('MPMA ERP API is running...');
});

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/transport-bookings', transportBookingRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/classroom-bookings', classroomBookingRoutes);
app.use('/api/auditorium-bookings', auditoriumBookingRoutes);
app.use('/api/maintenances', maintenanceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Sync specific models if not handled by root sync
Maintenance.sync({ alter: true }).then(() => {
  console.log("Maintenance model synced");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
