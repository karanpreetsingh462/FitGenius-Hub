# FitSphere Chatbot Setup Guide 🤖

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

### 3. Access the Chatbot
- **Main Website**: http://localhost:3000
- **Chatbot Page**: http://localhost:3000/chatbot
- **API Health Check**: http://localhost:3000/api/health

## Chatbot Features

### 🎯 **Quick Message Buttons**
- Beginner Workout
- Vegan Diet Plan
- Weight Loss Tips
- Muscle Building
- Chest Exercises
- Motivation
- Help Guide
- Back Exercises
- Leg Exercises

### 💬 **Custom Messages You Can Try**
- "Hello" - Get a greeting
- "I need a workout plan" - Get personalized workout advice
- "How to lose weight?" - Weight loss nutrition tips
- "Show me chest exercises" - Specific exercise recommendations
- "I need motivation" - Encouraging messages
- "What can you help me with?" - See all available features
- "Give me a vegan meal plan" - Complete diet plan
- "I'm a beginner" - Beginner-friendly advice
- "Advanced workout" - Advanced training tips

### 🧠 **Smart Responses**
The chatbot understands context and provides:
- **Personalized advice** based on fitness level
- **Detailed exercise lists** for each muscle group
- **Complete diet plans** (vegan, vegetarian, high-protein)
- **Motivational messages** when you're struggling
- **Nutrition guidance** for different goals

### 🔧 **API Endpoints**
- `POST /api/chatbot/general` - General fitness advice
- `POST /api/chatbot/message` - Simple message response
- `POST /api/chatbot/workout` - Workout-specific advice
- `POST /api/chatbot/nutrition` - Nutrition advice
- `POST /api/chatbot/custom-diet` - Custom diet plans

## Example API Usage

```javascript
// Send a message to the chatbot
const response = await fetch('/api/chatbot/message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    message: 'I need a beginner workout' 
  })
});

const data = await response.json();
console.log(data.data.message);
```

## Troubleshooting

### Server Won't Start
- Make sure Node.js is installed (v16+)
- Check if port 3000 is available
- Run `npm install` to install dependencies

### Chatbot Not Responding
- Check browser console for errors
- Verify server is running on http://localhost:3000
- Test API endpoint: http://localhost:3000/api/health

### API Errors
- Check that all dependencies are installed
- Verify the chatbot routes are properly loaded
- Check server logs for detailed error messages

## Customization

You can customize the chatbot responses by editing `routes/chatbot.js`:
- Add new response categories
- Modify existing responses
- Add new exercise types
- Customize diet plans

The chatbot is built entirely in code - no external APIs required! 🚀 