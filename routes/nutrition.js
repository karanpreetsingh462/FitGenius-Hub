const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { FoodItem, Meal, DietPlan, NutritionLog } = require('../models/Nutrition');

const router = express.Router();

// @desc    Get all food items
// @route   GET /api/nutrition/foods
// @access  Public
router.get('/foods', optionalAuth, async (req, res) => {
  try {
    const { category, dietaryTag, search } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (dietaryTag) query.dietaryTags = dietaryTag;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const foods = await FoodItem.find(query).sort('name');
    
    res.json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (error) {
    console.error('Get foods error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get food item by ID
// @route   GET /api/nutrition/foods/:id
// @access  Public
router.get('/foods/:id', optionalAuth, async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }

    res.json({
      success: true,
      data: food
    });
  } catch (error) {
    console.error('Get food error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all meals
// @route   GET /api/nutrition/meals
// @access  Public
router.get('/meals', optionalAuth, async (req, res) => {
  try {
    const { type, difficulty, search } = req.query;
    
    let query = {};
    
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const meals = await Meal.find(query)
      .populate('ingredients.food')
      .sort('name');
    
    res.json({
      success: true,
      count: meals.length,
      data: meals
    });
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get meal by ID
// @route   GET /api/nutrition/meals/:id
// @access  Public
router.get('/meals/:id', optionalAuth, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id)
      .populate('ingredients.food');
    
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    res.json({
      success: true,
      data: meal
    });
  } catch (error) {
    console.error('Get meal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all diet plans
// @route   GET /api/nutrition/diet-plans
// @access  Public
router.get('/diet-plans', optionalAuth, async (req, res) => {
  try {
    const { type, difficulty, createdBy } = req.query;
    
    let query = { isPublic: true };
    
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (createdBy) query.createdBy = createdBy;

    const dietPlans = await DietPlan.find(query)
      .populate('createdBy', 'name')
      .populate('meals.meal')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: dietPlans.length,
      data: dietPlans
    });
  } catch (error) {
    console.error('Get diet plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get diet plan by ID
// @route   GET /api/nutrition/diet-plans/:id
// @access  Public
router.get('/diet-plans/:id', optionalAuth, async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('meals.meal')
      .populate('meals.alternatives');
    
    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    res.json({
      success: true,
      data: dietPlan
    });
  } catch (error) {
    console.error('Get diet plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create diet plan
// @route   POST /api/nutrition/diet-plans
// @access  Private
router.post('/diet-plans', protect, [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Diet plan name must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('type')
    .isIn(['vegan', 'vegetarian', 'omnivore', 'keto', 'paleo', 'mediterranean', 'low_carb', 'high_protein', 'balanced'])
    .withMessage('Invalid diet type'),
  body('targetCalories')
    .isInt({ min: 800, max: 5000 })
    .withMessage('Target calories must be between 800 and 5000'),
  body('meals')
    .isArray({ min: 1 })
    .withMessage('At least one meal is required')
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

    const { name, description, type, targetCalories, targetProtein, targetCarbs, targetFat, meals, difficulty, tags } = req.body;

    // Validate meals
    for (let meal of meals) {
      const mealExists = await Meal.findById(meal.meal);
      if (!mealExists) {
        return res.status(400).json({
          success: false,
          message: `Meal with ID ${meal.meal} not found`
        });
      }
    }

    const dietPlan = await DietPlan.create({
      name,
      description,
      type,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
      meals,
      difficulty,
      tags,
      createdBy: req.user.id
    });

    await dietPlan.populate('createdBy', 'name');
    await dietPlan.populate('meals.meal');

    res.status(201).json({
      success: true,
      message: 'Diet plan created successfully',
      data: dietPlan
    });
  } catch (error) {
    console.error('Create diet plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during diet plan creation'
    });
  }
});

// @desc    Log nutrition
// @route   POST /api/nutrition/log
// @access  Private
router.post('/log', protect, [
  body('meals')
    .isArray()
    .withMessage('Meals must be an array'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO date')
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

    const { meals, totalCalories, totalProtein, totalCarbs, totalFat, waterIntake, notes, date } = req.body;

    const nutritionLog = await NutritionLog.create({
      user: req.user.id,
      date: date || new Date(),
      meals,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      waterIntake,
      notes
    });

    await nutritionLog.populate('meals.food');

    res.status(201).json({
      success: true,
      message: 'Nutrition logged successfully',
      data: nutritionLog
    });
  } catch (error) {
    console.error('Log nutrition error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during nutrition logging'
    });
  }
});

// @desc    Get user nutrition logs
// @route   GET /api/nutrition/logs
// @access  Private
router.get('/logs', protect, async (req, res) => {
  try {
    const { limit = 10, page = 1, startDate, endDate } = req.query;
    
    let query = { user: req.user.id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const logs = await NutritionLog.find(query)
      .populate('meals.food')
      .sort('-date')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await NutritionLog.countDocuments(query);

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
    console.error('Get nutrition logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get nutrition summary
// @route   GET /api/nutrition/summary
// @access  Private
router.get('/summary', protect, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const logs = await NutritionLog.find({
      user: req.user.id,
      date: { $gte: startDate }
    }).sort('date');

    // Calculate averages
    const totalDays = logs.length;
    const averages = logs.reduce((acc, log) => {
      acc.calories += log.totalCalories || 0;
      acc.protein += log.totalProtein || 0;
      acc.carbs += log.totalCarbs || 0;
      acc.fat += log.totalFat || 0;
      acc.water += log.waterIntake || 0;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0 });

    if (totalDays > 0) {
      averages.calories = Math.round(averages.calories / totalDays);
      averages.protein = Math.round(averages.protein / totalDays);
      averages.carbs = Math.round(averages.carbs / totalDays);
      averages.fat = Math.round(averages.fat / totalDays);
      averages.water = Math.round(averages.water / totalDays);
    }

    res.json({
      success: true,
      data: {
        period: `${days} days`,
        totalDays,
        averages,
        logs: logs.map(log => ({
          date: log.date,
          calories: log.totalCalories,
          protein: log.totalProtein,
          carbs: log.totalCarbs,
          fat: log.totalFat,
          water: log.waterIntake
        }))
      }
    });
  } catch (error) {
    console.error('Get nutrition summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 