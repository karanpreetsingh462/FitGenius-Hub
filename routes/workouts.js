const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { Exercise, Workout, WorkoutLog } = require('../models/Workout');

const router = express.Router();

// @desc    Get all exercises
// @route   GET /api/workouts/exercises
// @access  Public
router.get('/exercises', optionalAuth, async (req, res) => {
  try {
    const { category, muscleGroup, difficulty, equipment } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (muscleGroup) query.muscleGroups = muscleGroup;
    if (difficulty) query.difficulty = difficulty;
    if (equipment) query.equipment = equipment;

    const exercises = await Exercise.find(query).sort('name');
    
    res.json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get exercise by ID
// @route   GET /api/workouts/exercises/:id
// @access  Public
router.get('/exercises/:id', optionalAuth, async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    res.json({
      success: true,
      data: exercise
    });
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all workouts
// @route   GET /api/workouts
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { type, difficulty, muscleGroup, createdBy } = req.query;
    
    let query = { isPublic: true };
    
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (muscleGroup) query.targetMuscleGroups = muscleGroup;
    if (createdBy) query.createdBy = createdBy;

    const workouts = await Workout.find(query)
      .populate('createdBy', 'name')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: workouts.length,
      data: workouts
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get workout by ID
// @route   GET /api/workouts/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('exercises.exercise');
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.json({
      success: true,
      data: workout
    });
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create workout
// @route   POST /api/workouts
// @access  Private
router.post('/', protect, [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Workout name must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('type')
    .isIn(['strength', 'cardio', 'flexibility', 'hiit', 'circuit', 'yoga', 'pilates', 'crossfit', 'custom'])
    .withMessage('Invalid workout type'),
  body('difficulty')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid difficulty level'),
  body('duration')
    .isInt({ min: 5, max: 300 })
    .withMessage('Duration must be between 5 and 300 minutes'),
  body('exercises')
    .isArray({ min: 1 })
    .withMessage('At least one exercise is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { name, description, type, difficulty, duration, exercises, targetMuscleGroups, equipment, tags } = req.body;

    // Validate exercises
    for (let exercise of exercises) {
      const exerciseExists = await Exercise.findById(exercise.exercise);
      if (!exerciseExists) {
        return res.status(400).json({
          success: false,
          message: `Exercise with ID ${exercise.exercise} not found`
        });
      }
    }

    const workout = await Workout.create({
      name,
      description,
      type,
      difficulty,
      duration,
      exercises,
      targetMuscleGroups,
      equipment,
      tags,
      createdBy: req.user.id
    });

    await workout.populate('createdBy', 'name');
    await workout.populate('exercises.exercise');

    res.status(201).json({
      success: true,
      message: 'Workout created successfully',
      data: workout
    });
  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during workout creation'
    });
  }
});

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    // Check if user owns the workout or is admin
    if (workout.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this workout'
      });
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name').populate('exercises.exercise');

    res.json({
      success: true,
      message: 'Workout updated successfully',
      data: updatedWorkout
    });
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during workout update'
    });
  }
});

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    // Check if user owns the workout or is admin
    if (workout.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this workout'
      });
    }

    await workout.deleteOne();

    res.json({
      success: true,
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during workout deletion'
    });
  }
});

// @desc    Log workout
// @route   POST /api/workouts/:id/log
// @access  Private
router.post('/:id/log', protect, [
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 minute'),
  body('exercises')
    .isArray()
    .withMessage('Exercises must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    const { duration, exercises, calories, rating, notes, completed = true } = req.body;

    const workoutLog = await WorkoutLog.create({
      user: req.user.id,
      workout: req.params.id,
      duration,
      exercises,
      calories,
      rating,
      notes,
      completed
    });

    await workoutLog.populate('workout');
    await workoutLog.populate('exercises.exercise');

    res.status(201).json({
      success: true,
      message: 'Workout logged successfully',
      data: workoutLog
    });
  } catch (error) {
    console.error('Log workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during workout logging'
    });
  }
});

// @desc    Get user workout logs
// @route   GET /api/workouts/logs
// @access  Private
router.get('/logs', protect, async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    const logs = await WorkoutLog.find({ user: req.user.id })
      .populate('workout')
      .populate('exercises.exercise')
      .sort('-date')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await WorkoutLog.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      count: logs.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: logs
    });
  } catch (error) {
    console.error('Get workout logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 