const RiskAssessment = require('../models/riskAssessmentModel');
const Policy = require('../models/policyModel');
const { logger } = require('../utils/logger');

exports.getRiskAssessment = async (req, res) => {
  const { policyId } = req.params;

  try {
    const riskAssessment = await RiskAssessment.findOne({
      where: { policyId },
      order: [['createdAt', 'DESC']]
    });

    if (!riskAssessment) {
      return res.status(404).json({ message: 'Risk assessment not found' });
    }

    res.status(200).json(riskAssessment);
  } catch (err) {
    logger.error('Error fetching risk assessment:', err);
    res.status(500).json({ message: 'Error fetching risk assessment' });
  }
};

exports.updateRiskAssessment = async (req, res) => {
  const { policyId } = req.params;
  const {
    riskScore,
    floodZoneCategory,
    predictedAnnualLoss,
    assessmentFactors
  } = req.body;

  try {
    const [riskAssessment, created] = await RiskAssessment.findOrCreate({
      where: { policyId },
      defaults: {
        riskScore,
        floodZoneCategory,
        predictedAnnualLoss,
        assessmentFactors,
        nextAssessmentDate: calculateNextAssessmentDate()
      }
    });

    if (!created) {
      await riskAssessment.update({
        riskScore,
        floodZoneCategory,
        predictedAnnualLoss,
        assessmentFactors,
        lastUpdated: new Date(),
        nextAssessmentDate: calculateNextAssessmentDate()
      });
    }

    // Update policy risk level
    await Policy.update(
      { riskLevel: calculateRiskLevel(riskScore) },
      { where: { id: policyId } }
    );

    res.status(200).json(riskAssessment);
  } catch (err) {
    logger.error('Error updating risk assessment:', err);
    res.status(500).json({ message: 'Error updating risk assessment' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await RiskAssessment.findAll({
      attributes: [
        'floodZoneCategory',
        [sequelize.fn('AVG', sequelize.col('riskScore')), 'averageRiskScore'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalAssessments']
      ],
      group: ['floodZoneCategory']
    });

    res.status(200).json(analytics);
  } catch (err) {
    logger.error('Error generating analytics:', err);
    res.status(500).json({ message: 'Error generating analytics' });
  }
};

// Helper functions
const calculateNextAssessmentDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 12);
  return date;
};

const calculateRiskLevel = (riskScore) => {
  if (riskScore >= 70) return 'high';
  if (riskScore >= 30) return 'medium';
  return 'low';
};
