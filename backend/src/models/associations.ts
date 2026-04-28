import Maintenance from './Maintenance';
import { Classroom } from './Classroom';
import { Vehicle } from './Vehicle';
import { ClassroomBooking } from './ClassroomBooking';
import { TransportBooking } from './TransportBooking';

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
};
