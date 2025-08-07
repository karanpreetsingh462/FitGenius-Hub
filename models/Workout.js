const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Exercise description is required']
  },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'balance', 'sports'],
    required: true
  },
  muscleGroups: [{
    type: String,
    enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'abs', 'obliques', 'quads', 'hamstrings', 'calves', 'glutes', 'full_body']
  }],
  equipment: [{
    type: String,
    enum: ['barbell', 'dumbbell', 'kettlebell', 'cable', 'machine', 'bodyweight', 'resistance_band', 'medicine_ball', 'stability_ball', 'foam_roller', 'none']
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  instructions: [String],
  tips: [String],
  videoUrl: String,
  imageUrl: String,
  caloriesPerMinute: {
    type: Number,
    min: 0
  }
});

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Workout name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Workout description is required']
  },
  type: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'hiit', 'circuit', 'yoga', 'pilates', 'crossfit', 'custom'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: [5, 'Workout must be at least 5 minutes'],
    max: [300, 'Workout cannot exceed 300 minutes']
  },
  exercises: [{
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true
    },
    sets: {
      type: Number,
      min: 1,
      default: 3
    },
    reps: {
      type: Number,
      min: 1,
      default: 10
    },
    weight: {
      type: Number, // in kg
      min: 0,
      default: 0
    },
    duration: {
      type: Number, // in seconds
      min: 0
    },
    rest: {
      type: Number, // in seconds
      min: 0,
      default: 60
    },
    notes: String
  }],
  targetMuscleGroups: [{
    type: String,
    enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'abs', 'obliques', 'quads', 'hamstrings', 'calves', 'glutes', 'full_body']
  }],
  equipment: [{
    type: String,
    enum: ['barbell', 'dumbbell', 'kettlebell', 'cable', 'machine', 'bodyweight', 'resistance_band', 'medicine_ball', 'stability_ball', 'foam_roller', 'none']
  }],
  calories: {
    type: Number,
    min: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
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

const workoutLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // actual duration in minutes
    required: true
  },
  exercises: [{
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true
    },
    sets: [{
      reps: Number,
      weight: Number,
      duration: Number,
      completed: {
        type: Boolean,
        default: true
      }
    }],
    notes: String
  }],
  calories: {
    type: Number,
    min: 0
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  notes: String,
  completed: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
workoutSchema.index({ type: 1, difficulty: 1 });
workoutSchema.index({ targetMuscleGroups: 1 });
workoutSchema.index({ createdBy: 1 });
workoutLogSchema.index({ user: 1, date: -1 });

module.exports = {
  Exercise: mongoose.model('Exercise', exerciseSchema),
  Workout: mongoose.model('Workout', workoutSchema),
  WorkoutLog: mongoose.model('WorkoutLog', workoutLogSchema)
}; 