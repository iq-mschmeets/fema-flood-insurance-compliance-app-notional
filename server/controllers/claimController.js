const Claim = require('../models/claimModel');
const Policy = require('../models/policyModel');
const { sendClaimNotification } = require('../services/emailService');
const { logger } = require('../utils/logger');

exports.createClaim = async (req, res) => {
  const {
    policyId,
    claimAmount,
    incidentDescription,
    photos,
    incidentDate
  } = req.body;

  try {
    // Verify policy exists and is active
    const policy = await Policy.findByPk(policyId);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    if (policy.status !== 'active') {
      return res.status(400).json({ message: 'Policy is not active' });
    }

    const newClaim = await Claim.create({
      policyId,
      claimAmount,
      incidentDescription,
      photos,
      incidentDate,
      claimDate: new Date(),
      claimNumber: generateClaimNumber(),
      submittedBy: req.user.id
    });

    // Send notification
    await sendClaimNotification({
      type: 'CLAIM_SUBMITTED',
      claim: newClaim,
      policy,
      recipient: policy.policyholder.email
    });

    res.status(201).json(newClaim);
  } catch (err) {
    logger.error('Error creating claim:', err);
    res.status(500).json({ message: 'Error creating claim' });
  }
};

exports.updateClaimStatus = async (req, res) => {
  const { id } = req.params;
  const { status, adjustorNotes, approvedAmount } = req.body;

  try {
    const claim = await Claim.findByPk(id, {
      include: [{ model: Policy }]
    });

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    await claim.update({
      status,
      adjustorNotes,
      approvedAmount
    });

    // Send notification
    await sendClaimNotification({
      type: 'CLAIM_STATUS_UPDATED',
      claim,
      status,
      recipient: claim.Policy.policyholder.email
    });

    res.status(200).json(claim);
  } catch (err) {
    logger.error('Error updating claim:', err);
    res.status(500).json({ message: 'Error updating claim' });
  }
};

exports.getClaim = async (req, res) => {
  const { id } = req.params;

  try {
    const claim = await Claim.findByPk(id, {
      include: [{ model: Policy }]
    });

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    res.status(200).json(claim);
  } catch (err) {
    logger.error('Error fetching claim:', err);
    res.status(500).json({ message: 'Error fetching claim' });
  }
};

exports.getClaims = async (req, res) => {
  const { policyId, status } = req.query;
  
  try {
    const where = {};
    if (policyId) where.policyId = policyId;
    if (status) where.status = status;

    const claims = await Claim.findAll({
      where,
      include: [{ model: Policy }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(claims);
  } catch (err) {
    logger.error('Error fetching claims:', err);
    res.status(500).json({ message: 'Error fetching claims' });
  }
};

// Helper function
const generateClaimNumber = () => {
  return 'CLM-' + Date.now().toString().slice(-8) + 
         Math.random().toString(36).substring(2, 5).toUpperCase();
};
