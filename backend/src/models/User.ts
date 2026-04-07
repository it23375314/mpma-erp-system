import { sequelize, DataTypes, Model, Optional } from '../config/db';

export interface UserAttributes {
  id: string; // Wait, let's use UUIDs or auto-incrementing integers? Integers are standard for MySQL, but existing frontend uses strings (Mongo IDs). Let's use UUIDs so they map 1:1 with string IDs.
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user' | 'officer';
  createdAt?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'user' | 'officer';
  public readonly createdAt!: string;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'officer'),
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    tableName: 'users',
  }
);
