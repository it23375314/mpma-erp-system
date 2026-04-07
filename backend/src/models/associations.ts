import { Classroom } from './Classroom';
import { ClassroomBooking } from './ClassroomBooking';
import { Vehicle } from './Vehicle';
import { TransportBooking } from './TransportBooking';
import Maintenance from './Maintenance';

export const setupAssociations = () => {
  // Classroom <-> ClassroomBooking
  Classroom.hasMany(ClassroomBooking, { foreignKey: 'classroomId', as: 'bookings' });
  ClassroomBooking.belongsTo(Classroom, { foreignKey: 'classroomId', as: 'classroom' });

  // Vehicle <-> TransportBooking
  Vehicle.hasMany(TransportBooking, { foreignKey: 'vehicleId', as: 'bookings' });
  TransportBooking.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });

  // Maintenance -> Classroom/Vehicle
  Maintenance.belongsTo(Classroom, { foreignKey: 'facilityId', as: 'classroom', constraints: false });
  Maintenance.belongsTo(Vehicle, { foreignKey: 'facilityId', as: 'vehicle', constraints: false });
};
