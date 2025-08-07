const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Custom Chatbot Logic
class FitGeniusChatbot {
  constructor() {
    this.responses = {
      greetings: [
        "Hello! I'm FitSphere AI, your personal fitness assistant. How can I help you today?",
        "Hi there! Ready to crush your fitness goals? What can I help you with?",
        "Welcome to FitSphere! I'm here to help you with your fitness journey.",
        "Hey! I'm your AI fitness buddy. Let's make your fitness dreams a reality!"
      ],
      workout: {
        beginner: [
          "For beginners, I recommend starting with bodyweight exercises: push-ups, squats, lunges, and planks. Start with 3 sets of 10 reps each, 3 times per week.",
          "Begin with basic movements: wall push-ups, assisted squats, and walking. Focus on form over intensity.",
          "Start with 20-30 minute sessions: 10 min cardio (walking), 10 min strength (bodyweight), 10 min stretching."
        ],
        intermediate: [
          "Try circuit training: 30 seconds each of burpees, mountain climbers, jumping jacks, rest 30 seconds, repeat 3-5 rounds.",
          "Incorporate weights: dumbbell squats, bench press, deadlifts. 3-4 sets of 8-12 reps.",
          "Mix cardio and strength: 20 min HIIT, 20 min strength training, 10 min cool-down."
        ],
        advanced: [
          "Advanced workout: supersets with heavy weights, plyometric exercises, and high-intensity intervals.",
          "Try complex movements: Olympic lifts, advanced calisthenics, and sport-specific training.",
          "Advanced circuit: 45 seconds work, 15 seconds rest, 6-8 exercises, 4-5 rounds."
        ]
      },
      nutrition: {
        weight_loss: [
          "For weight loss: Create a 500-calorie daily deficit. Eat lean proteins, complex carbs, and healthy fats. Track your calories.",
          "Weight loss diet: High protein (1.6g per kg bodyweight), moderate carbs, low fat. Eat in a calorie deficit.",
          "Focus on whole foods: chicken, fish, vegetables, fruits, whole grains. Avoid processed foods and sugary drinks."
        ],
        muscle_gain: [
          "For muscle gain: Eat 300-500 calories above maintenance. 1.6-2.2g protein per kg bodyweight daily.",
          "Muscle building diet: High protein, moderate carbs, moderate fat. Eat every 3-4 hours.",
          "Post-workout: 20-30g protein within 30 minutes. Include carbs for glycogen replenishment."
        ],
        maintenance: [
          "Maintenance diet: Balanced macronutrients - 40% carbs, 30% protein, 30% fat. Eat at maintenance calories.",
          "Focus on nutrient-dense foods: vegetables, fruits, lean proteins, whole grains, healthy fats.",
          "Eat mindfully and listen to your body's hunger and fullness cues."
        ]
      },
      diet_plans: {
        vegan: {
          breakfast: "Oatmeal with berries, chia seeds, and almond milk. Add a banana for extra energy.",
          lunch: "Quinoa bowl with chickpeas, roasted vegetables, and tahini dressing.",
          dinner: "Lentil curry with brown rice and steamed broccoli.",
          snacks: "Hummus with carrot sticks, mixed nuts, or a protein smoothie with plant-based protein powder."
        },
        vegetarian: {
          breakfast: "Greek yogurt with granola and honey, or scrambled eggs with whole grain toast.",
          lunch: "Mediterranean salad with feta cheese, olives, and olive oil dressing.",
          dinner: "Grilled halloumi with quinoa and roasted vegetables.",
          snacks: "Cottage cheese with fruit, hard-boiled eggs, or protein bars."
        },
        high_protein: {
          breakfast: "Protein pancakes with whey protein, eggs, and oats.",
          lunch: "Grilled chicken breast with sweet potato and green vegetables.",
          dinner: "Salmon with quinoa and asparagus.",
          snacks: "Protein shake, Greek yogurt, or turkey jerky."
        }
      },
      exercises: {
        chest: ["Push-ups", "Bench press", "Dumbbell flyes", "Incline press", "Decline push-ups"],
        back: ["Pull-ups", "Deadlifts", "Rows", "Lat pulldowns", "Face pulls"],
        legs: ["Squats", "Deadlifts", "Lunges", "Leg press", "Calf raises"],
        shoulders: ["Overhead press", "Lateral raises", "Front raises", "Rear delt flyes", "Shrugs"],
        arms: ["Bicep curls", "Tricep dips", "Hammer curls", "Skull crushers", "Preacher curls"],
        core: ["Planks", "Crunches", "Russian twists", "Leg raises", "Mountain climbers"]
      },
      motivation: [
        "Remember: Progress takes time. Focus on consistency over perfection.",
        "Every workout makes you stronger. Keep pushing forward!",
        "Your future self will thank you for the work you put in today.",
        "Small steps lead to big changes. Stay committed to your goals.",
        "You're stronger than you think. Believe in yourself!"
      ]
    };
  }

  // Analyze user message and generate response
  generateResponse(message, userProfile = {}) {
    const lowerMessage = message.toLowerCase();
    
    // Greetings
    if (this.containsAny(lowerMessage, ['hello', 'hi', 'hey', 'start', 'good morning', 'good afternoon', 'good evening'])) {
      return this.getRandomResponse('greetings');
    }

    // Workout related
    if (this.containsAny(lowerMessage, ['workout', 'exercise', 'training', 'gym', 'fitness', 'training'])) {
      const level = this.getFitnessLevel(lowerMessage, userProfile);
      return this.getRandomResponse(`workout.${level}`);
    }

    // Nutrition related
    if (this.containsAny(lowerMessage, ['diet', 'nutrition', 'food', 'eat', 'meal', 'calories', 'protein', 'carbs'])) {
      if (this.containsAny(lowerMessage, ['lose', 'weight', 'fat', 'burn', 'slim', 'thin'])) {
        return this.getRandomResponse('nutrition.weight_loss');
      } else if (this.containsAny(lowerMessage, ['muscle', 'gain', 'build', 'strength', 'bulk', 'mass'])) {
        return this.getRandomResponse('nutrition.muscle_gain');
      } else {
        return this.getRandomResponse('nutrition.maintenance');
      }
    }

    // Diet plans
    if (this.containsAny(lowerMessage, ['diet plan', 'meal plan', 'vegan', 'vegetarian', 'high protein', 'protein diet'])) {
      return this.generateDietPlan(lowerMessage, userProfile);
    }

    // Specific exercises
    if (this.containsAny(lowerMessage, ['chest', 'push', 'bench', 'pecs'])) {
      return `💪 **Chest Exercises**: ${this.responses.exercises.chest.join(', ')}. Start with 3 sets of 10-12 reps. Focus on proper form and controlled movements.`;
    }
    if (this.containsAny(lowerMessage, ['back', 'pull', 'row', 'lats'])) {
      return `🏋️ **Back Exercises**: ${this.responses.exercises.back.join(', ')}. Focus on proper form and mind-muscle connection.`;
    }
    if (this.containsAny(lowerMessage, ['legs', 'squat', 'thigh', 'quads', 'hamstrings'])) {
      return `🦵 **Leg Exercises**: ${this.responses.exercises.legs.join(', ')}. Start with bodyweight squats and progress gradually.`;
    }
    if (this.containsAny(lowerMessage, ['shoulder', 'deltoid', 'delts'])) {
      return `💪 **Shoulder Exercises**: ${this.responses.exercises.shoulders.join(', ')}. Start light to avoid injury and focus on form.`;
    }
    if (this.containsAny(lowerMessage, ['arm', 'bicep', 'tricep', 'forearm'])) {
      return `💪 **Arm Exercises**: ${this.responses.exercises.arms.join(', ')}. Include both biceps and triceps for balanced development.`;
    }
    if (this.containsAny(lowerMessage, ['core', 'abs', 'stomach', 'six pack'])) {
      return `🔥 **Core Exercises**: ${this.responses.exercises.core.join(', ')}. Focus on stability, control, and breathing.`;
    }

    // Motivation
    if (this.containsAny(lowerMessage, ['motivation', 'tired', 'hard', 'difficult', 'struggle', 'give up', 'quit'])) {
      return this.getRandomResponse('motivation');
    }

    // Help and guidance
    if (this.containsAny(lowerMessage, ['help', 'what can you do', 'how to use', 'guide'])) {
      return `🤖 **I can help you with:**

💪 **Workouts**: Beginner to advanced training plans
🥗 **Nutrition**: Diet advice and meal planning  
📊 **Fitness Goals**: Weight loss, muscle gain, maintenance
🎯 **Specific Exercises**: Chest, back, legs, arms, core
💪 **Motivation**: Encouragement and tips
📋 **Diet Plans**: Vegan, vegetarian, high-protein options

Just ask me anything about fitness and nutrition!`;
    }

    // Default response
    return "I'm here to help with your fitness journey! Ask me about workouts, nutrition, diet plans, or specific exercises. What would you like to know? 💪";
  }

  // Generate a custom diet plan
  generateDietPlan(message, userProfile) {
    let dietType = 'high_protein'; // default
    
    if (this.containsAny(message, ['vegan'])) {
      dietType = 'vegan';
    } else if (this.containsAny(message, ['vegetarian'])) {
      dietType = 'vegetarian';
    }

    const plan = this.responses.diet_plans[dietType];
    
    return `Here's your ${dietType.replace('_', ' ')} diet plan:

🌅 Breakfast: ${plan.breakfast}

🌞 Lunch: ${plan.lunch}

🌙 Dinner: ${plan.dinner}

🍎 Snacks: ${plan.snacks}

💡 Tips:
• Eat every 3-4 hours
• Stay hydrated (8-10 glasses of water daily)
• Include protein with every meal
• Choose whole foods over processed options
• Listen to your body's hunger cues

Would you like me to customize this plan further based on your specific goals?`;
  }

  // Helper methods
  containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  getFitnessLevel(message, userProfile) {
    if (this.containsAny(message, ['beginner', 'start', 'new', 'first time'])) {
      return 'beginner';
    } else if (this.containsAny(message, ['advanced', 'expert', 'hard'])) {
      return 'advanced';
    } else {
      return 'intermediate';
    }
  }

  getRandomResponse(category) {
    const responses = this.getNestedValue(this.responses, category);
    if (Array.isArray(responses)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
    return responses;
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }
}

// Initialize chatbot
const chatbot = new FitGeniusChatbot();

// @desc    Get AI workout recommendation
// @route   POST /api/chatbot/workout
// @access  Public (with optional auth)
router.post('/workout', optionalAuth, [
  body('message')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Message must be between 10 and 500 characters'),
  body('userProfile')
    .optional()
    .isObject()
    .withMessage('User profile must be an object')
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

    const { message, userProfile } = req.body;
    const user = req.user;

    // Generate response using custom chatbot
    const response = chatbot.generateResponse(message, userProfile || user?.profile);

    res.json({
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString(),
        user: user ? user.id : null
      }
    });

  } catch (error) {
    console.error('Chatbot workout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your request. Please try again.'
    });
  }
});

// @desc    Get AI nutrition recommendation
// @route   POST /api/chatbot/nutrition
// @access  Public (with optional auth)
router.post('/nutrition', optionalAuth, [
  body('message')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Message must be between 10 and 500 characters'),
  body('userProfile')
    .optional()
    .isObject()
    .withMessage('User profile must be an object')
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

    const { message, userProfile } = req.body;
    const user = req.user;

    // Generate response using custom chatbot
    const response = chatbot.generateResponse(message, userProfile || user?.profile);

    res.json({
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString(),
        user: user ? user.id : null
      }
    });

  } catch (error) {
    console.error('Chatbot nutrition error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your request. Please try again.'
    });
  }
});

// @desc    Get AI custom diet plan
// @route   POST /api/chatbot/custom-diet
// @access  Public (with optional auth)
router.post('/custom-diet', optionalAuth, [
  body('requirements')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Requirements must be between 20 and 1000 characters'),
  body('userProfile')
    .optional()
    .isObject()
    .withMessage('User profile must be an object')
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

    const { requirements, userProfile } = req.body;
    const user = req.user;

    // Generate custom diet plan
    const dietPlan = chatbot.generateDietPlan(requirements, userProfile || user?.profile);

    res.json({
      success: true,
      data: {
        dietPlan: dietPlan,
        timestamp: new Date().toISOString(),
        user: user ? user.id : null
      }
    });

  } catch (error) {
    console.error('Chatbot custom diet error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your request. Please try again.'
    });
  }
});

// @desc    Get AI general fitness advice
// @route   POST /api/chatbot/general
// @access  Public (with optional auth)
router.post('/general', optionalAuth, [
  body('message')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters')
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

    const { message } = req.body;
    const user = req.user;

    // Generate response using custom chatbot
    const response = chatbot.generateResponse(message, user?.profile);

    res.json({
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString(),
        user: user ? user.id : null
      }
    });

  } catch (error) {
    console.error('Chatbot general error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your request. Please try again.'
    });
  }
});

// @desc    Get AI message response (simplified endpoint)
// @route   POST /api/chatbot/message
// @access  Public
router.post('/message', [
  body('message')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters')
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

    const { message } = req.body;

    // Generate response using custom chatbot
    const response = chatbot.generateResponse(message);

    res.json({
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Chatbot message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your request. Please try again.'
    });
  }
});

module.exports = router; 