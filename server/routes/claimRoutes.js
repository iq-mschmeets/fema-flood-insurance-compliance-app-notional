const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const claimController = require('../controllers/claimController');

router.use(authenticate); // Require authentication for all claim routes

// Submit new claim
router.post('/',
  authorize(['admin', 'agent', 'policyholder']),
  claimController.createClaim
);

// Update claim status
router.put('/:id/status',
  authorize(['admin', 'agent']),
  claimController.updateClaimStatus
);

// Get single claim
router.get('/:id',
  authorize(['admin', 'agent', 'policyholder']),
  claimController.getClaim
);

// Get all claims
router.get('/',
  authorize(['admin', 'agent']),
  claimController.getClaims
);

module.exports = router;
