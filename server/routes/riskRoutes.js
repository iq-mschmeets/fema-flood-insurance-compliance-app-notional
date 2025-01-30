const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const riskController = require('../controllers/riskController');

router.use(authenticate); // Require authentication for all risk routes

// Get risk assessment for a policy
router.get('/assessment/:policyId',
  authorize(['admin', 'agent']),
  riskController.getRiskAssessment
);

// Update risk assessment
router.put('/assessment/:policyId',
  authorize(['admin']),
  riskController.updateRiskAssessment
);

// Get risk analytics
router.get('/analytics',
  authorize(['admin']),
  riskController.getAnalytics
);

module.exports = router;
