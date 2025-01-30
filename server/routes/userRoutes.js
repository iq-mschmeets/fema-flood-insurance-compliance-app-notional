const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const User = require('../models/userModel');
const { logger } = require('../utils/logger');

// Get all users (admin only)
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'status', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user by ID (admin or self)
router.get('/:id', authenticate, async (req, res) => {
  try {
    // Check if user is admin or requesting their own data
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'role', 'status', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
});

// Update user (admin or self)
router.put('/:id', authenticate, async (req, res) => {
  try {
    // Check if user is admin or updating their own data
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { firstName, lastName, email } = req.body;
    
    // Only admin can update role and status
    const updates = {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email
    };

    if (req.user.role === 'admin') {
      if (req.body.role) updates.role = req.body.role;
      if (req.body.status) updates.status = req.body.status;
    }

    await user.update(updates);

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin user' });
      }
    }

    // Soft delete by updating status to 'inactive'
    await user.update({ status: 'inactive' });
    
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Change user role (admin only)
router.patch('/:id/role', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent changing role of the last admin
    if (user.role === 'admin' && role !== 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot change role of the last admin' });
      }
    }

    await user.update({ role });
    
    res.json({
      message: 'User role updated successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Error updating user role:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
});

// Bulk status update (admin only)
router.patch('/bulk/status', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { userIds, status } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'User IDs array is required' });
    }

    // If trying to deactivate users, ensure we're not deactivating all admins
    if (status === 'inactive') {
      const adminUsers = await User.findAll({
        where: {
          id: userIds,
          role: 'admin'
        }
      });

      if (adminUsers.length > 0) {
        const totalAdmins = await User.count({ where: { role: 'admin' } });
        if (adminUsers.length >= totalAdmins) {
          return res.status(400).json({ message: 'Cannot deactivate all admin users' });
        }
      }
    }

    await User.update(
      { status },
      {
        where: {
          id: userIds
        }
      }
    );

    res.json({ message: `Successfully updated status for ${userIds.length} users` });
  } catch (error) {
    logger.error('Error in bulk status update:', error);
    res.status(500).json({ message: 'Error updating user statuses' });
  }
});

module.exports = router;
