import { sequelize, DataTypes, Model, Optional } from '../config/db';

interface VehicleAttributes {
  id: string;
  name: string;
  number: string;
  capacity: number;
  type: string;
  acStatus: string;
  status: string;
}

interface VehicleCreationAttributes extends Optional<VehicleAttributes, 'id'> {}

export class Vehicle extends Model<VehicleAttributes, VehicleCreationAttributes> implements VehicleAttributes {
  public id!: string;
  public name!: string;
  public number!: string;
  public capacity!: number;
  public type!: string;
  public acStatus!: string;
  public status!: string;
}

Vehicle.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    number: { type: DataTypes.STRING, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    acStatus: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Available' },
  },
  {
    sequelize,
    tableName: 'vehicles',
  }
);
