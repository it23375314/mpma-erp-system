import Maintenance from './Maintenance';
import { Classroom } from './Classroom';
import { Vehicle } from './Vehicle';
import { ClassroomBooking } from './ClassroomBooking';
import { TransportBooking } from './TransportBooking';
import StudentPayment from './StudentPayment';
import Student from './Student';

export const setupAssociations = () => {
  // Classroom & Bookings
  Classroom.hasMany(ClassroomBooking, { foreignKey: 'classroomId', as: 'bookings' });
  ClassroomBooking.belongsTo(Classroom, { foreignKey: 'classroomId', as: 'classroom' });

  // Vehicle & Bookings
  Vehicle.hasMany(TransportBooking, { foreignKey: 'vehicleId', as: 'bookings' });
  TransportBooking.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });

  // Maintenance associations
  Maintenance.belongsTo(Classroom, { foreignKey: 'facilityId', as: 'classroom', constraints: false });
  Maintenance.belongsTo(Vehicle, { foreignKey: 'facilityId', as: 'vehicle', constraints: false });

  // StudentPayment & Student associations
  // A student can have many payments; each payment belongs to one student.
  Student.hasMany(StudentPayment, { foreignKey: 'student_id', as: 'payments', constraints: false });
  StudentPayment.belongsTo(Student, { foreignKey: 'student_id', as: 'student', constraints: false });
};
