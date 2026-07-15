import { sequelize, DataTypes, Model, Optional } from '../config/db';

interface Attributes {
  id: string; serviceNumber: string; epfNumber: string; nic: string; fullName: string;
  firstName: string; lastName: string; department: string; position: string; dob: string;
  gender: 'Male' | 'Female' | 'Other'; email?: string | null; phone?: string | null; active: boolean;
}
type Creation = Optional<Attributes, 'id' | 'email' | 'phone' | 'active'>;
export class SlpaEmployee extends Model<Attributes, Creation> implements Attributes {
  declare id: string; declare serviceNumber: string; declare epfNumber: string; declare nic: string;
  declare fullName: string; declare firstName: string; declare lastName: string; declare department: string;
  declare position: string; declare dob: string; declare gender: 'Male' | 'Female' | 'Other';
  declare email: string | null; declare phone: string | null; declare active: boolean;
}
SlpaEmployee.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  serviceNumber: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'service_number' },
  epfNumber: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'epf_number' },
  nic: { type: DataTypes.STRING, allowNull: false, unique: true }, fullName: { type: DataTypes.STRING, allowNull: false, field: 'full_name' },
  firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' }, lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
  department: { type: DataTypes.STRING, allowNull: false }, position: { type: DataTypes.STRING, allowNull: false },
  dob: { type: DataTypes.DATEONLY, allowNull: false }, gender: { type: DataTypes.ENUM('Male','Female','Other'), allowNull: false },
  email: { type: DataTypes.STRING, allowNull: true }, phone: { type: DataTypes.STRING, allowNull: true },
  active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { sequelize, tableName: 'slpa_employees', underscored: true });
export default SlpaEmployee;
