const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private (admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is requesting their own profile or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this user profile'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user membership
// @route   PUT /api/users/:id/membership
// @access  Private (admin)
router.put('/:id/membership', protect, authorize('admin'), async (req, res) => {
  try {
    const { type, startDate, endDate, isActive } = req.body;

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.membership = {
      type: type || user.membership.type,
      startDate: startDate || user.membership.startDate,
      endDate: endDate || user.membership.endDate,
      isActive: isActive !== undefined ? isActive : user.membership.isActive
    };

    await user.save();

    res.json({
      success: true,
      message: 'Membership updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          membership: user.membership
        }
      }
    });
  } catch (error) {
    console.error('Update membership error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during membership update'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Private
router.get('/:id/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is requesting their own stats or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this user stats'
      });
    }

    // Calculate BMI if height and weight are available
    const bmi = user.getBMI();
    const bmiCategory = user.getBMICategory();

    const stats = {
      profile: {
        age: user.profile.age,
        gender: user.profile.gender,
        height: user.profile.height,
        weight: user.profile.weight,
        fitnessLevel: user.profile.fitnessLevel,
        goals: user.profile.goals,
        bmi: bmi,
        bmiCategory: bmiCategory
      },
      membership: {
        type: user.membership.type,
        isActive: user.membership.isActive,
        startDate: user.membership.startDate,
        endDate: user.membership.endDate
      },
      preferences: user.preferences,
      lastLogin: user.lastLogin,
      memberSince: user.createdAt
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during user deletion'
    });
  }
});

module.exports = router; 