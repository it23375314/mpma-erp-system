import { sequelize, DataTypes, Model } from '../config/db';

interface AuditoriumBookingAttributes {
  id?: string;
  name: string;
  contact: string;
  date: string;
  start: string;
  end: string;
  participants: number;
  description: string;
  status: string;
}

export class AuditoriumBooking extends Model<AuditoriumBookingAttributes> implements AuditoriumBookingAttributes {
  public id!: string;
  public name!: string;
  public contact!: string;
  public date!: string;
  public start!: string;
  public end!: string;
  public participants!: number;
  public description!: string;
  public status!: string;
}

AuditoriumBooking.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  contact: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.STRING, allowNull: false },
  start: { type: DataTypes.STRING, allowNull: false },
  end: { type: DataTypes.STRING, allowNull: false },
  participants: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' }
}, {
  sequelize,
  tableName: 'auditorium_bookings'
});
