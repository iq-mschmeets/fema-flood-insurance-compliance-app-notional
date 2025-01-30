const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Claim = sequelize.define('Claim', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  policyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Policies',
      key: 'id'
    }
  },
  claimNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  claimAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  incidentDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  incidentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  claimDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('submitted', 'under_review', 'approved', 'rejected'),
    defaultValue: 'submitted'
  },
  photos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  documents: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  adjustorNotes: {
    type: DataTypes.TEXT
  },
  approvedAmount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  submittedBy: {
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

module.exports = Claim;
