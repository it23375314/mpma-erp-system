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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const Classroom_1 = require("../models/Classroom");
const Vehicle_1 = require("../models/Vehicle");
const TransportBooking_1 = require("../models/TransportBooking");
const AuditoriumBooking_1 = require("../models/AuditoriumBooking");
const associations_1 = require("../models/associations");
const seedData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Setup associations
        (0, associations_1.setupAssociations)();
        // Authenticate and sync
        yield db_1.sequelize.authenticate();
        console.log('Database connected.');
        // Seed 15 Classrooms
        const classroomsCount = yield Classroom_1.Classroom.count();
        if (classroomsCount === 0) {
            const classrooms = [];
            const locations = ['Block A, Level 1', 'Block A, Level 2', 'Block B, Level 1', 'Block C, Ground Floor', 'Main Wing, East'];
            const facilitiesList = [['AC', 'Projector'], ['AC', 'Smart Board', 'Audio System'], ['Projector', 'Whiteboard'], ['AC', 'Webcam', 'Microphone']];
            for (let i = 1; i <= 15; i++) {
                classrooms.push({
                    name: `Classroom ${100 + i}`,
                    capacity: 20 + (Math.floor(Math.random() * 6) * 10),
                    location: locations[Math.floor(Math.random() * locations.length)],
                    examReady: Math.random() > 0.3 ? 'Yes' : 'No',
                    facilities: facilitiesList[Math.floor(Math.random() * facilitiesList.length)]
                });
            }
            yield Classroom_1.Classroom.bulkCreate(classrooms);
            console.log('15 Classrooms created.');
        }
        // Seed 5 Vehicles
        let createdVehicles = yield Vehicle_1.Vehicle.findAll();
        if (createdVehicles.length === 0) {
            const vehicles = [
                { name: 'Toyota Hiace', number: 'WP CAS-1234', capacity: 14, type: 'Van', acStatus: 'AC', status: 'Available' },
                { name: 'Mitsubishi Rosa', number: 'WP NB-5678', capacity: 28, type: 'Bus', acStatus: 'AC', status: 'Available' },
                { name: 'Toyota Prius', number: 'WP CAD-9012', capacity: 4, type: 'Car', acStatus: 'AC', status: 'Available' },
                { name: 'Nissan Caravan', number: 'WP PB-3456', capacity: 12, type: 'Van', acStatus: 'Non-AC', status: 'Available' },
                { name: 'Isuzu Journey', number: 'WP NA-7890', capacity: 32, type: 'Bus', acStatus: 'AC', status: 'Available' },
            ];
            createdVehicles = yield Vehicle_1.Vehicle.bulkCreate(vehicles);
            console.log('5 Vehicles created.');
        }
        // Seed 15 Transport Bookings
        const transportBookings = [];
        const destinations = ['Colombo', 'Kandy', 'Galle', 'Matara', 'Jaffna', 'Anuradhapura', 'Trincomalee'];
        const purposes = ['Field Trip', 'Staff Meeting', 'Guest Pickup', 'Site Visit', 'Emergency'];
        const departments = ['ICT', 'Engineering', 'Business', 'Science', 'Arts'];
        for (let i = 1; i <= 15; i++) {
            const vehicle = createdVehicles[Math.floor(Math.random() * createdVehicles.length)];
            const date = new Date();
            date.setDate(date.getDate() + Math.floor(Math.random() * 14));
            const dateString = date.toISOString().split('T')[0];
            transportBookings.push({
                requesterName: `Officer ${i}`,
                designation: 'Staff',
                department: departments[Math.floor(Math.random() * departments.length)],
                contactNumber: `07${Math.floor(Math.random() * 10000000)}`,
                departureDate: dateString,
                returnDate: dateString,
                departureTime: '07:00:00',
                pickupLocation: 'Main Campus',
                destination: destinations[Math.floor(Math.random() * destinations.length)],
                purpose: purposes[Math.floor(Math.random() * purposes.length)],
                vehicleId: vehicle.id,
                status: ['Pending', 'Approved', 'Rejected'][Math.floor(Math.random() * 3)]
            });
        }
        yield TransportBooking_1.TransportBooking.bulkCreate(transportBookings);
        console.log('15 Transport Bookings created.');
        // Seed 5 Auditorium Bookings
        const auditoriumBookings = [];
        const events = ['Graduation Ceremony', 'Guest Lecture', 'Annual General Meeting', 'Drama Competition', 'Career Fair'];
        for (let i = 1; i <= 5; i++) {
            const date = new Date();
            date.setDate(date.getDate() + Math.floor(Math.random() * 60));
            const dateString = date.toISOString().split('T')[0];
            auditoriumBookings.push({
                name: `Organizer ${i}`,
                contact: `011${Math.floor(Math.random() * 1000000)}`,
                date: dateString,
                start: '09:00',
                end: '16:00',
                participants: 100 + (Math.floor(Math.random() * 5) * 50),
                description: events[i - 1],
                status: ['Pending', 'Approved'][Math.floor(Math.random() * 2)]
            });
        }
        yield AuditoriumBooking_1.AuditoriumBooking.bulkCreate(auditoriumBookings);
        console.log('5 Auditorium Bookings created.');
        console.log('Seeding completed successfully.');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
});
seedData();
