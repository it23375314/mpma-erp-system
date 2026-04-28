import { sequelize, DataTypes, Model, Optional } from '../config/db';

interface TransportBookingAttributes {
  id?: string;
  requesterName: string;
  designation: string;
  department: string;
  contactNumber: string;
  departureDate: string;
  returnDate: string;
  departureTime: string;
  pickupLocation: string;
  destination: string;
  purpose: string;
  vehicleId: string;
  estimatedKm?: string;
  status: string;
}

export class TransportBooking extends Model<TransportBookingAttributes> implements TransportBookingAttributes {
  public id!: string;
  public requesterName!: string;
  public designation!: string;
  public department!: string;
  public contactNumber!: string;
  public departureDate!: string;
  public returnDate!: string;
  public departureTime!: string;
  public pickupLocation!: string;
  public destination!: string;
  public purpose!: string;
  public vehicleId!: string;
  public estimatedKm!: string;
  public status!: string;
}

TransportBooking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    requesterName: { type: DataTypes.STRING, allowNull: false },
    designation: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: false },
    contactNumber: { type: DataTypes.STRING, allowNull: false },
    departureDate: { type: DataTypes.STRING, allowNull: false },
    returnDate: { type: DataTypes.STRING, allowNull: false },
    departureTime: { type: DataTypes.STRING, allowNull: false },
    pickupLocation: { type: DataTypes.STRING, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
    purpose: { type: DataTypes.STRING, allowNull: false },
    vehicleId: { type: DataTypes.UUID, allowNull: false },
    estimatedKm: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' }
  },
  {
    sequelize,
    tableName: 'transport_bookings',
  }
);
