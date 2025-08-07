const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['protein', 'carbohydrate', 'fat', 'vegetable', 'fruit', 'dairy', 'grain', 'supplement'],
    required: true
  },
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  protein: {
    type: Number,
    min: 0,
    default: 0
  },
  carbohydrates: {
    type: Number,
    min: 0,
    default: 0
  },
  fat: {
    type: Number,
    min: 0,
    default: 0
  },
  fiber: {
    type: Number,
    min: 0,
    default: 0
  },
  sugar: {
    type: Number,
    min: 0,
    default: 0
  },
  sodium: {
    type: Number,
    min: 0,
    default: 0
  },
  servingSize: {
    amount: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true,
      enum: ['g', 'ml', 'cup', 'tbsp', 'tsp', 'piece', 'slice']
    }
  },
  allergens: [String],
  dietaryTags: [{
    type: String,
    enum: ['vegan', 'vegetarian', 'gluten_free', 'dairy_free', 'nut_free', 'organic', 'non_gmo']
  }],
  imageUrl: String,
  description: String
});

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Meal name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'],
    required: true
  },
  description: String,
  ingredients: [{
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  }],
  instructions: [String],
  prepTime: {
    type: Number, // in minutes
    min: 0
  },
  cookTime: {
    type: Number, // in minutes
    min: 0
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  imageUrl: String,
  tags: [String],
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

const dietPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Diet plan name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Diet plan description is required']
  },
  type: {
    type: String,
    enum: ['vegan', 'vegetarian', 'omnivore', 'keto', 'paleo', 'mediterranean', 'low_carb', 'high_protein', 'balanced'],
    required: true
  },
  targetCalories: {
    type: Number,
    required: true,
    min: [800, 'Minimum calories should be 800'],
    max: [5000, 'Maximum calories should be 5000']
  },
  targetProtein: {
    type: Number, // in grams
    min: 0
  },
  targetCarbs: {
    type: Number, // in grams
    min: 0
  },
  targetFat: {
    type: Number, // in grams
    min: 0
  },
  meals: [{
    day: {
      type: Number,
      min: 1,
      max: 7,
      required: true
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true
    },
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal',
      required: true
    },
    alternatives: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal'
    }]
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  tags: [String],
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

const nutritionLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  meals: [{
    type: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true
    },
    foods: [{
      food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItem',
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        required: true
      }
    }],
    notes: String
  }],
  totalCalories: {
    type: Number,
    min: 0,
    default: 0
  },
  totalProtein: {
    type: Number,
    min: 0,
    default: 0
  },
  totalCarbs: {
    type: Number,
    min: 0,
    default: 0
  },
  totalFat: {
    type: Number,
    min: 0,
    default: 0
  },
  waterIntake: {
    type: Number, // in ml
    min: 0,
    default: 0
  },
  notes: String
}, {
  timestamps: true
});

// Indexes for better query performance
dietPlanSchema.index({ type: 1, difficulty: 1 });
dietPlanSchema.index({ createdBy: 1 });
nutritionLogSchema.index({ user: 1, date: -1 });

module.exports = {
  FoodItem: mongoose.model('FoodItem', foodItemSchema),
  Meal: mongoose.model('Meal', mealSchema),
  DietPlan: mongoose.model('DietPlan', dietPlanSchema),
  NutritionLog: mongoose.model('NutritionLog', nutritionLogSchema)
}; 