# FitGenius Hub 🏋️‍♂️

A comprehensive fitness and nutrition platform that combines AI-powered chatbot assistance, personalized workout plans, diet management, and community features to help users achieve their fitness goals.

![FitGenius Hub](https://img.shields.io/badge/FitGenius-Hub-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-yellow)

## 🌟 Features

### 🤖 AI-Powered Chatbot
- **Custom Fitness Assistant**: Built entirely in code without external APIs
- **Personalized Responses**: Tailored workout and nutrition advice based on user level
- **Diet Plan Generation**: Custom meal plans for vegan, vegetarian, and high-protein diets
- **Exercise Recommendations**: Targeted workouts for different muscle groups and fitness levels
- **Motivational Support**: Encouraging messages to keep users motivated

### 💪 Workout Management
- **Exercise Library**: Comprehensive database of exercises with detailed instructions
- **Workout Plans**: Pre-built and customizable workout routines
- **Progress Tracking**: Log and monitor your fitness journey
- **Difficulty Levels**: Beginner, intermediate, and advanced workout options
- **Muscle Group Targeting**: Focus on specific body areas

### 🥗 Nutrition & Diet Plans
- **Food Database**: Extensive collection of food items with nutritional information
- **Meal Planning**: Create and customize meal plans
- **Diet Types**: Support for vegan, vegetarian, and high-protein diets
- **Nutrition Logging**: Track daily food intake and nutritional goals
- **Dietary Restrictions**: Filter by dietary preferences and restrictions

### 👥 User Management
- **User Authentication**: Secure login and registration system
- **Profile Management**: Personal fitness profiles and preferences
- **Progress Tracking**: Monitor fitness and nutrition goals
- **Social Features**: Share achievements and connect with others

### 📱 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Beautiful Interface**: Modern, clean design with smooth animations
- **Interactive Elements**: Engaging user experience with real-time updates
- **Accessibility**: Designed for users of all abilities

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0**: Modern UI framework
- **Material-UI**: Component library for consistent design
- **Redux Toolkit**: State management
- **React Router**: Navigation and routing
- **Chart.js**: Data visualization for progress tracking
- **Axios**: HTTP client for API communication
- **Socket.io**: Real-time communication
- **React Hook Form**: Form handling and validation
- **Yup**: Schema validation

### Backend
- **Spring Boot 3.2.0**: Java-based REST API
- **Spring Security**: Authentication and authorization
- **Spring Data MongoDB**: Database operations
- **JWT**: Token-based authentication
- **WebSocket**: Real-time features
- **Spring Mail**: Email notifications
- **SpringDoc OpenAPI**: API documentation

### Database
- **MongoDB**: NoSQL database for flexible data storage
- **MongoDB Atlas**: Cloud database hosting

### DevOps
- **Vercel**: Frontend deployment
- **Maven**: Java dependency management
- **npm**: Node.js package management

## 📁 Project Structure

```
FitGenius/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   │   ├── images/         # Image assets
│   │   ├── css/           # Stylesheets
│   │   └── js/            # JavaScript libraries
│   ├── src/               # React source code
│   └── package.json       # Frontend dependencies
├── backend/                # Spring Boot backend
│   ├── src/main/java/     # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── pom.xml           # Maven dependencies
├── routes/                # Express.js API routes
├── models/                # Database models
├── middleware/            # Authentication middleware
├── config/               # Database configuration
└── vercel.json          # Deployment configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Java 17 or higher
- MongoDB (local or Atlas)
- Maven 3.6+

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Configure database**:
   - Update `application.yml` with your MongoDB connection string
   - Set up environment variables for JWT secrets

3. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

4. **Access API documentation**:
   - Swagger UI: `http://localhost:8080/swagger-ui.html`
   - API Base URL: `http://localhost:8080/api`

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_NAME=FitGenius Hub
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Workouts
- `GET /api/workouts/exercises` - Get all exercises
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create workout
- `GET /api/workouts/:id` - Get workout by ID

### Nutrition
- `GET /api/nutrition/foods` - Get all food items
- `GET /api/nutrition/meals` - Get all meals
- `POST /api/nutrition/diet-plans` - Create diet plan
- `GET /api/nutrition/logs` - Get nutrition logs

### Chatbot
- `POST /api/chatbot/message` - Send message to chatbot
- `GET /api/chatbot/history` - Get chat history

## 🤖 Chatbot Features

The FitGenius chatbot provides intelligent responses for:

- **Workout Guidance**: Personalized exercise recommendations
- **Nutrition Advice**: Diet tips and meal planning
- **Motivation**: Encouraging messages and goal setting
- **Fitness Education**: Exercise form and technique tips
- **Progress Tracking**: Help with monitoring fitness goals

### Sample Chatbot Interactions

```
User: "I'm a beginner, what workouts should I do?"
Bot: "For beginners, I recommend starting with bodyweight exercises: push-ups, squats, lunges, and planks. Start with 3 sets of 10 reps each, 3 times per week."

User: "I want to lose weight, what should I eat?"
Bot: "For weight loss: Create a 500-calorie daily deficit. Eat lean proteins, complex carbs, and healthy fats. Track your calories."

User: "Give me a vegan meal plan"
Bot: "Here's a vegan meal plan: Breakfast - Oatmeal with berries and chia seeds. Lunch - Quinoa bowl with chickpeas and vegetables. Dinner - Lentil curry with brown rice."
```

## 🎨 UI Components

The application features a modern, responsive design with:

- **Hero Section**: Engaging landing page with call-to-action
- **Navigation**: Smooth scrolling navigation menu
- **Cards**: Information display for workouts and nutrition
- **Forms**: User-friendly input forms with validation
- **Charts**: Progress visualization
- **Chat Interface**: Interactive chatbot interface

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Encrypted password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Cross-origin resource sharing setup
- **Rate Limiting**: API request throttling

## 📊 Performance Features

- **Caching**: Redis caching for improved performance
- **Image Optimization**: Compressed and optimized images
- **Lazy Loading**: On-demand component loading
- **Code Splitting**: Optimized bundle sizes
- **CDN Integration**: Fast content delivery

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure build settings in `vercel.json`
3. Deploy automatically on push to main branch

### Backend (Spring Boot)
1. Build the JAR file: `mvn clean package`
2. Deploy to your preferred cloud platform
3. Configure environment variables
4. Set up MongoDB connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Spring Boot team for the robust backend framework
- Material-UI for the beautiful component library
- MongoDB team for the flexible database solution

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/docs` folder

---

**FitGenius Hub** - Empowering your fitness journey with AI-powered guidance and comprehensive health management tools. 💪✨ 