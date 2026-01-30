# CropPulse - Project Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- Java 11+ (for backend)
- PostgreSQL (for database)
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
spring.datasource.username=your_username
spring.datasource.password=your_password
GROQ_API_KEY=your_groq_api_key
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
JWT_SECRET=your_secret_key
```

**Important**: For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password.

Set environment variables:
```bash
set GROQ_API_KEY=your_key
set MAIL_USERNAME=your_email@gmail.com
set MAIL_PASSWORD=your_app_password
set DB_PASSWORD=your_db_password
set JWT_SECRET=your_secret_key
```

Build and run:
```bash
mvn clean install
mvn spring-boot:run
# Runs on http://localhost:8080
```

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

```sql
CREATE DATABASE croppulse_db;
```

The backend will auto-create tables using Hibernate DDL.

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
- Check PostgreSQL is running
- Verify database credentials in application.properties
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
