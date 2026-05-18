# CropPulse - Project Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- Java 11+ (for backend)
- MongoDB (for database)
- Python 3.8+ (for AI service)

## Project Structure

```
CropPulse/
├── Frontend/           # React + Vite application
├── backend/            # Spring Boot backend service
├── croppulse-ai/       # Python FastAPI AI service
└── README.md           # This file
```

## Environment Setup

### 1. Frontend Setup

```bash
cd Frontend
npm install
cp .env.example .env
```

Update `.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

Start development server:
```bash
npm run dev
# Runs on http://localhost:5173
```

### 2. Backend Setup

```bash
cd backend
```

Create `src/main/resources/application-local.properties`:
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/croppulse
GROQ_API_KEY=your_groq_api_key
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
JWT_SECRET=your_secret_key
```

The main backend configuration now expects `MONGODB_URI` to be set in the environment, so make sure your local shell or deployment platform provides it before starting Spring Boot.

**Important**: For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

Set environment variables:
```bash
set GROQ_API_KEY=your_key
set MAIL_USERNAME=your_email@gmail.com
set MAIL_PASSWORD=your_app_password
set MONGODB_URI=mongodb://localhost:27017/croppulse
set JWT_SECRET=your_secret_key
```

Build and run:
```bash
mvn clean install
mvn spring-boot:run
# Runs on http://localhost:8080
```

For Render or any other hosted environment, set `MONGODB_URI` to your Atlas or managed MongoDB connection string instead of relying on a localhost fallback.

### 3. AI Service Setup (Python)

```bash
cd croppulse-ai
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

pip install fastapi uvicorn pandas scikit-learn joblib numpy

# Train models (one-time setup)
python train_model.py
python train_price_model.py

# Start AI service
uvicorn main:app --reload --port 8000
# Runs on http://localhost:8000
```

## Database Setup

Start MongoDB locally or via Docker, then create a `croppulse` database by connecting once through the app or shell. The backend will auto-create collections as documents are saved.

## Development Workflow

1. **Start all services**:
   - Frontend: `npm run dev`
   - Backend: `mvn spring-boot:run`
   - AI Service: `uvicorn main:app --reload --port 8000`

2. **Access the application**:
   - Frontend: http://localhost:5173
   - API Docs: http://localhost:8080/swagger-ui.html
   - AI Service: http://localhost:8000/docs

## Key Features

- 🌾 Crop Recommendation System (using ML)
- 💰 Price Prediction & Market Trends
- 💬 Real-time Farmer-Buyer Chat
- 🤖 AI-powered Chatbot
- 📊 Analytics Dashboard
- 🔐 Secure Authentication (JWT)

## Building for Production

### Frontend
```bash
cd Frontend
npm run build
```

### Backend
```bash
cd backend
mvn clean package
```

### Docker Support (Optional)
Each service can be containerized. Docker files should be added for production deployment.

## Troubleshooting

**Backend won't start**:
- Check MongoDB is running
- Verify `MONGODB_URI` is set correctly
- Ensure environment variables are set

**Frontend can't connect to API**:
- Verify backend is running on port 8080
- Check CORS settings in application.properties
- Update `VITE_API_BASE_URL` if using different host

**AI Service errors**:
- Ensure all model files exist (run training scripts)
- Check Python dependencies: `pip install -r requirements.txt`

## Contributing

1. Create a feature branch
2. Make changes following project conventions
3. Test thoroughly
4. Commit with clear messages
5. Push and create pull request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions, please create an issue in the repository.
