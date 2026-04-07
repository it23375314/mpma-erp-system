import { sequelize, DataTypes, Model, Optional } from '../config/db';

interface ClassroomAttributes {
  id?: string;
  name: string;
  capacity: number;
  location: string;
  examReady: string;
  facilities: string[];
}

interface ClassroomCreationAttributes extends Optional<ClassroomAttributes, 'id'> {}

export class Classroom extends Model<ClassroomAttributes, ClassroomCreationAttributes> implements ClassroomAttributes {
  public id!: string;
  public name!: string;
  public capacity!: number;
  public location!: string;
  public examReady!: string;
  public facilities!: string[];
}

Classroom.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    examReady: { type: DataTypes.STRING, allowNull: false },
    facilities: { 
      type: DataTypes.JSON, 
      allowNull: false,
      defaultValue: [] 
    },
  },
  {
    sequelize,
    tableName: 'classrooms',
  }
);
