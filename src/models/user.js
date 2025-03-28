import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import { ROLES } from '../constants/constant.js'
import { USER_STATUS } from '../constants/constant.js'
import argon2 from 'argon2'

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    role: {
      type: DataTypes.ENUM(...Object.values(ROLES)),
      defaultValue: ROLES.CUSTOMER
    },
    status: {
      type: DataTypes.ENUM(...Object.values(USER_STATUS)),
      defaultValue: USER_STATUS.PENDING
    },
    lastLogin: {
      type: DataTypes.DATE
    },
    otpSecret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    otpExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await argon2.hash(user.password)
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await argon2.hash(user.password)
        }
      }
    }
  }
)

export default User
