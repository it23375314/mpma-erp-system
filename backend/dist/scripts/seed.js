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
const db_1 = require("../config/db");
const Classroom_1 = require("../models/Classroom");
const ClassroomBooking_1 = require("../models/ClassroomBooking");
const Vehicle_1 = require("../models/Vehicle");
const TransportBooking_1 = require("../models/TransportBooking");
const AuditoriumBooking_1 = require("../models/AuditoriumBooking");
const associations_1 = require("../models/associations");
const Maintenance_1 = __importDefault(require("../models/Maintenance"));
const seedData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Setup associations
        (0, associations_1.setupAssociations)();
        // Authenticate and sync
        yield db_1.sequelize.authenticate();
        console.log('Database connected.');
        const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];
        const makeDateString = (daysAheadMin, daysAheadMax) => {
            const date = new Date();
            date.setDate(date.getDate() + daysAheadMin + Math.floor(Math.random() * (daysAheadMax - daysAheadMin + 1)));
            return date.toISOString().split('T')[0];
        };
        const classroomNames = ['Physics Lab', 'Chemistry Room', 'Computer Lab', 'Language Lab', 'Lecture Hall A', 'Lecture Hall B'];
        const locations = ['Block A, Level 1', 'Block A, Level 2', 'Block B, Level 1', 'Block C, Ground Floor', 'Main Wing, East', 'Main Wing, West'];
        const facilitiesList = [
            ['AC', 'Projector'],
            ['AC', 'Smart Board', 'Audio System'],
            ['Projector', 'Whiteboard'],
            ['AC', 'Webcam', 'Microphone'],
            ['PA System', 'Podium'],
            ['Projector', 'Desktop PC']
        ];
        const vehicleTemplates = [
            { name: 'Toyota Coaster', number: 'WP BUS-1001', capacity: 30, type: 'Bus', acStatus: 'AC' },
            { name: 'Mitsubishi Rosa', number: 'WP BUS-1002', capacity: 28, type: 'Bus', acStatus: 'AC' },
            { name: 'Isuzu Journey', number: 'WP BUS-1003', capacity: 32, type: 'Bus', acStatus: 'AC' },
            { name: 'Ashok Leyland Falcon', number: 'WP BUS-1004', capacity: 40, type: 'Bus', acStatus: 'Non-AC' },
        ];
        const departments = ['ICT', 'Engineering', 'Business', 'Science', 'Arts', 'Administration'];
        const destinations = ['Colombo', 'Kandy', 'Galle', 'Matara', 'Jaffna', 'Anuradhapura', 'Trincomalee'];
        const purposes = ['Field Trip', 'Staff Meeting', 'Guest Pickup', 'Site Visit', 'Emergency', 'Workshop'];
        const courseNames = ['Advanced Excel', 'English Communication', 'Project Management', 'Data Science Basics', 'Teaching Methodology', 'Cyber Security Awareness'];
        const audienceTypes = ['Staff', 'Students', 'Mixed'];
        const courseCoordinators = ['Dr. Perera', 'Ms. Fernando', 'Mr. Silva', 'Dr. Jayasuriya', 'Ms. de Silva'];
        const auditoriumEvents = ['Graduation Ceremony', 'Guest Lecture', 'Annual General Meeting', 'Drama Competition', 'Career Fair', 'Award Night'];
        // Seed classrooms up to 15
        const classroomsCount = yield Classroom_1.Classroom.count();
        if (classroomsCount < 15) {
            const classroomsToCreate = [];
            for (let i = classroomsCount + 1; i <= 15; i++) {
                classroomsToCreate.push({
                    name: `${pickRandom(classroomNames)} ${100 + i}`,
                    capacity: 20 + (Math.floor(Math.random() * 7) * 5),
                    location: pickRandom(locations),
                    examReady: Math.random() > 0.25 ? 'Yes' : 'No',
                    facilities: pickRandom(facilitiesList)
                });
            }
            yield Classroom_1.Classroom.bulkCreate(classroomsToCreate);
            console.log(`${classroomsToCreate.length} Classrooms created.`);
        }
        const allClassrooms = yield Classroom_1.Classroom.findAll({ order: [['createdAt', 'ASC']] });
        // Seed 4 bus vehicles
        let createdVehicles = yield Vehicle_1.Vehicle.findAll({ order: [['createdAt', 'ASC']] });
        if (createdVehicles.length < 4) {
            const vehiclesToCreate = vehicleTemplates.slice(createdVehicles.length).map((vehicle, index) => (Object.assign(Object.assign({}, vehicle), { status: index % 2 === 0 ? 'Available' : 'Available' })));
            const newVehicles = yield Vehicle_1.Vehicle.bulkCreate(vehiclesToCreate);
            createdVehicles = [...createdVehicles, ...newVehicles];
            console.log(`${vehiclesToCreate.length} Vehicles created.`);
        }
        const allVehicles = yield Vehicle_1.Vehicle.findAll({ order: [['createdAt', 'ASC']] });
        // Seed 15 Classroom Bookings
        const classroomBookingsCount = yield ClassroomBooking_1.ClassroomBooking.count();
        if (classroomBookingsCount < 15) {
            const classroomBookings = [];
            for (let i = classroomBookingsCount + 1; i <= 15; i++) {
                const classroom = pickRandom(allClassrooms);
                const fromDate = makeDateString(1, 45);
                const toDate = fromDate;
                classroomBookings.push({
                    requestingOfficerName: `Coordinator ${i}`,
                    designation: pickRandom(['Lecturer', 'Instructor', 'Assistant Lecturer', 'Officer']),
                    requestingOfficerEmail: `user${i}@example.com`,
                    courseName: pickRandom(courseNames),
                    audienceType: pickRandom(audienceTypes),
                    batchCode: `BCH-${100 + i}`,
                    numberOfParticipants: 10 + Math.floor(Math.random() * 40),
                    dateFrom: fromDate,
                    dateTo: toDate,
                    courseCoordinator: pickRandom(courseCoordinators),
                    timeFrom: pickRandom(['08:00:00', '09:00:00', '13:00:00']),
                    timeTo: pickRandom(['12:00:00', '15:00:00', '17:00:00']),
                    preferredDaysOfWeek: pickRandom([
                        ['Monday', 'Wednesday'],
                        ['Tuesday', 'Thursday'],
                        ['Friday'],
                        ['Saturday']
                    ]),
                    paidCourse: Math.random() > 0.5 ? 'Yes' : 'No',
                    classroomId: classroom.id,
                    exam: Math.random() > 0.7 ? 'Yes' : 'No',
                    additionalRequirements: pickRandom(['Projector', 'Whiteboard', 'Sound system', 'No special requirements']),
                    status: pickRandom(['Pending', 'Approved', 'Rejected'])
                });
            }
            yield ClassroomBooking_1.ClassroomBooking.bulkCreate(classroomBookings);
            console.log(`${classroomBookings.length} Classroom Bookings created.`);
        }
        // Seed 15 Transport Bookings
        const transportBookingsCount = yield TransportBooking_1.TransportBooking.count();
        if (transportBookingsCount < 15) {
            const transportBookings = [];
            for (let i = transportBookingsCount + 1; i <= 15; i++) {
                const vehicle = pickRandom(allVehicles);
                const dateString = makeDateString(1, 21);
                transportBookings.push({
                    requesterName: `Officer ${i}`,
                    designation: pickRandom(['Staff', 'Lecturer', 'Coordinator']),
                    department: pickRandom(departments),
                    contactNumber: `07${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
                    departureDate: dateString,
                    returnDate: dateString,
                    departureTime: pickRandom(['07:00:00', '08:00:00', '09:00:00']),
                    pickupLocation: pickRandom(['Main Campus', 'City Office', 'Faculty Entrance']),
                    destination: pickRandom(destinations),
                    purpose: pickRandom(purposes),
                    vehicleId: vehicle.id,
                    status: pickRandom(['Pending', 'Approved', 'Rejected'])
                });
            }
            yield TransportBooking_1.TransportBooking.bulkCreate(transportBookings);
            console.log(`${transportBookings.length} Transport Bookings created.`);
        }
        // Seed 15 Auditorium Bookings
        const auditoriumBookingsCount = yield AuditoriumBooking_1.AuditoriumBooking.count();
        if (auditoriumBookingsCount < 15) {
            const auditoriumBookings = [];
            for (let i = auditoriumBookingsCount + 1; i <= 15; i++) {
                auditoriumBookings.push({
                    name: `Organizer ${i}`,
                    contact: `011${String(Math.floor(Math.random() * 1000000)).padStart(7, '0')}`,
                    date: makeDateString(1, 60),
                    start: pickRandom(['08:00', '09:00', '10:00', '13:00']),
                    end: pickRandom(['12:00', '15:00', '16:00', '18:00']),
                    participants: 50 + (Math.floor(Math.random() * 8) * 25),
                    description: pickRandom(auditoriumEvents),
                    status: pickRandom(['Pending', 'Approved'])
                });
            }
            yield AuditoriumBooking_1.AuditoriumBooking.bulkCreate(auditoriumBookings);
            console.log(`${auditoriumBookings.length} Auditorium Bookings created.`);
        }
        // Seed 15 Maintenance Records
        const maintenanceCount = yield Maintenance_1.default.count();
        if (maintenanceCount < 15) {
            const maintenances = [];
            const maintenanceTemplates = [
                { facilityType: 'Classroom', titlePrefix: 'AC Service', description: 'Routine classroom AC servicing.' },
                { facilityType: 'Transport', titlePrefix: 'Engine Check', description: 'Monthly vehicle inspection and oil change.' },
                { facilityType: 'Auditorium', titlePrefix: 'Seat Repair', description: 'Repairing seats and stage fittings.' },
                { facilityType: 'General', titlePrefix: 'Campus Inspection', description: 'General facility safety inspection.' }
            ];
            for (let i = maintenanceCount + 1; i <= 15; i++) {
                const template = pickRandom(maintenanceTemplates);
                const classroom = pickRandom(allClassrooms);
                const vehicle = pickRandom(allVehicles);
                const selectedFacilityId = template.facilityType === 'Classroom' ? classroom.id : template.facilityType === 'Transport' ? vehicle.id : undefined;
                const dateFrom = makeDateString(1, 45);
                const dateTo = dateFrom;
                maintenances.push({
                    title: `${template.titlePrefix} ${i}`,
                    description: template.description,
                    facilityType: template.facilityType,
                    facilityId: selectedFacilityId,
                    dateFrom,
                    dateTo,
                    timeFrom: pickRandom(['08:00:00', '09:00:00', '13:00:00']),
                    timeTo: pickRandom(['12:00:00', '15:00:00', '17:00:00'])
                });
            }
            yield Maintenance_1.default.bulkCreate(maintenances);
            console.log(`${maintenances.length} Maintenance records created.`);
        }
        console.log('Seeding completed successfully.');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
});
seedData();
