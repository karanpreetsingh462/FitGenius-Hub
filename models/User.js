const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'trainer', 'admin'],
    default: 'user'
  },
  profile: {
    age: {
      type: Number,
      min: [13, 'Age must be at least 13'],
      max: [100, 'Age cannot be more than 100']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: false
    },
    height: {
      type: Number, // in cm
      min: [100, 'Height must be at least 100cm'],
      max: [250, 'Height cannot be more than 250cm']
    },
    weight: {
      type: Number, // in kg
      min: [30, 'Weight must be at least 30kg'],
      max: [300, 'Weight cannot be more than 300kg']
    },
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    goals: [{
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'strength', 'general_fitness']
    }],
    dietaryPreferences: [{
      type: String,
      enum: ['vegan', 'vegetarian', 'omnivore', 'keto', 'paleo', 'mediterranean']
    }],
    medicalConditions: [String],
    allergies: [String]
  },
  membership: {
    type: {
      type: String,
      enum: ['basic', 'premium', 'elite'],
      default: 'basic'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  preferences: {
    workoutDuration: {
      type: Number, // in minutes
      default: 45
    },
    workoutFrequency: {
      type: Number, // times per week
      default: 3
    },
    preferredWorkoutTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening'],
      default: 'morning'
    }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate BMI
userSchema.methods.getBMI = function() {
  if (this.profile.height && this.profile.weight) {
    const heightInMeters = this.profile.height / 100;
    return (this.profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }
  return null;
};

// Get BMI category
userSchema.methods.getBMICategory = function() {
  const bmi = this.getBMI();
  if (!bmi) return null;
  
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
};

module.exports = mongoose.model('User', userSchema); 