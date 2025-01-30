const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RiskAssessment = sequelize.define('RiskAssessment', {
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
  riskScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  floodZoneCategory: {
    type: DataTypes.STRING,
    allowNull: false
  },
  historicalClaimsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  predictedAnnualLoss: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  assessmentFactors: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'JSON object containing detailed risk factors'
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  nextAssessmentDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = RiskAssessment;
