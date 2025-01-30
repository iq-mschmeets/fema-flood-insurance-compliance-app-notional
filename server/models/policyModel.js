const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Policy = sequelize.define('Policy', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  policyNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  policyholder: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'JSON object containing policyholder details (name, contact, address)'
  },
  premium: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  coverage: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'JSON object containing coverage details and limits'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'cancelled'),
    defaultValue: 'active'
  },
  riskLevel: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: false
  },
  floodZone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  paranoid: true // Soft deletes
});

module.exports = Policy;
