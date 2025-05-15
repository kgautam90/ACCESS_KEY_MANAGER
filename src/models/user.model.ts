import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { AccessKey } from './access_key.model';

interface UserAttributes {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  status: 'active' | 'inactive' | 'suspended';
}

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<UserAttributes> {
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
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare lastName: string;

  @Column({
    type: DataType.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active',
  })
  declare status: 'active' | 'inactive' | 'suspended';

  @HasMany(() => AccessKey)
  declare accessKeys: AccessKey[];
} 