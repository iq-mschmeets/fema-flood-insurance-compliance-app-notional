const Policy = require('../models/policyModel');
const RiskAssessment = require('../models/riskAssessmentModel');
const { logger } = require('../utils/logger');

exports.createPolicy = async (req, res) => {
  const { policyholder, premium, coverage, startDate, endDate, floodZone } = req.body;
  
  try {
    const newPolicy = await Policy.create({
      policyholder,
      premium,
      coverage,
      startDate,
      endDate,
      floodZone,
      riskLevel: await calculateRiskLevel(floodZone),
      createdBy: req.user.id,
      policyNumber: generatePolicyNumber()
    });

    // Create initial risk assessment
    await RiskAssessment.create({
      policyId: newPolicy.id,
      riskScore: await calculateRiskScore(floodZone),
      floodZoneCategory: floodZone,
      predictedAnnualLoss: calculatePredictedLoss(premium),
      assessmentFactors: {
        floodZone,
        propertyType: policyholder.propertyType,
        constructionYear: policyholder.constructionYear
      },
      nextAssessmentDate: calculateNextAssessmentDate()
    });

    res.status(201).json(newPolicy);
  } catch (err) {
    logger.error('Error creating policy:', err);
    res.status(500).json({ message: 'Error creating policy' });
  }
};

exports.updatePolicy = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const policy = await Policy.findByPk(id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    await policy.update(updates);
    res.status(200).json(policy);
  } catch (err) {
    logger.error('Error updating policy:', err);
    res.status(500).json({ message: 'Error updating policy' });
  }
};

exports.getPolicy = async (req, res) => {
  const { id } = req.params;

  try {
    const policy = await Policy.findByPk(id, {
      include: [{ model: RiskAssessment }]
    });
    
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    res.status(200).json(policy);
  } catch (err) {
    logger.error('Error fetching policy:', err);
    res.status(500).json({ message: 'Error fetching policy' });
  }
};

exports.getPolicies = async (req, res) => {
  try {
    const policies = await Policy.findAll({
      where: { status: 'active' },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(policies);
  } catch (err) {
    logger.error('Error fetching policies:', err);
    res.status(500).json({ message: 'Error fetching policies' });
  }
};

// Helper functions
const calculateRiskLevel = async (floodZone) => {
  // Implementation based on FEMA flood zone classifications
  const highRiskZones = ['A', 'V', 'AE', 'VE'];
  const mediumRiskZones = ['B', 'X500'];
  
  if (highRiskZones.includes(floodZone)) return 'high';
  if (mediumRiskZones.includes(floodZone)) return 'medium';
  return 'low';
};

const calculateRiskScore = async (floodZone) => {
  // Implementation of risk scoring algorithm
  // Returns a score between 0-100
  return 50; // Placeholder
};

const calculatePredictedLoss = (premium) => {
  // Simple calculation based on premium
  return premium * 0.7;
};

const calculateNextAssessmentDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 12);
  return date;
};

const generatePolicyNumber = () => {
  return 'POL-' + Date.now().toString().slice(-8) + 
         Math.random().toString(36).substring(2, 5).toUpperCase();
};
