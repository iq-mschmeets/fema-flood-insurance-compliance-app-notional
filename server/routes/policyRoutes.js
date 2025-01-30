const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const policyController = require('../controllers/policyController');

router.use(authenticate); // Require authentication for all policy routes

// Create new policy
router.post('/',
  authorize(['admin', 'agent']),
  policyController.createPolicy
);

// Update policy
router.put('/:id',
  authorize(['admin', 'agent']),
  policyController.updatePolicy
);

// Get single policy
router.get('/:id',
  authorize(['admin', 'agent', 'policyholder']),
  policyController.getPolicy
);

// Get all policies
router.get('/',
  authorize(['admin', 'agent']),
  policyController.getPolicies
);

module.exports = router;
