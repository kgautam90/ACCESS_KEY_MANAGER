import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { AccessKey } from './access_key.model';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active',
  })
  status: 'active' | 'inactive' | 'suspended';

  @HasMany(() => AccessKey)
  accessKeys: AccessKey[];
} 