import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'access_keys',
  timestamps: true,
})
export class AccessKey extends Model {
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
  accessKey: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 60, // Default rate limit of 60 requests per minute
  })
  rateLimitPerMinute: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiryDate: Date;

  @Column({
    type: DataType.ENUM('active', 'inactive', 'expired'),
    defaultValue: 'active',
  })
  status: 'active' | 'inactive' | 'expired';
  @Column({
    type: DataType.VIRTUAL,
    get() {
      return this.getDataValue('usageCount');
    },
    set(value: number) {
      this.setDataValue('usageCount', value);
    },
  })
  usageCount: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;
} 