# CropPulse

> Intelligent Agricultural Decision Support System

A full-stack application that connects farmers and buyers while providing AI-powered crop recommendations and market insights.

## 🌾 Features

- **Smart Crop Recommendations** - ML-based recommendations using soil type, climate, and land size
- **Price Predictions** - AI-powered market price forecasting
- **Real-time Chat** - WebSocket-based direct communication between farmers and buyers
- **Market Analytics** - Visualize crop availability, trends, and opportunities
- **AI Chatbot** - 24/7 agricultural guidance using Groq AI
- **User Profiles** - Detailed farmer and buyer profiles with crop tracking
- **Secure Authentication** - JWT-based user authentication

## 🏗️ Architecture

### Technology Stack

**Frontend**
- React 19 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Recharts for data visualization
- Axios for API calls
- React-Toastify for notifications
- WebSocket for real-time chat

**Backend**
- Spring Boot 3.x
- MongoDB database
- Spring Security with JWT
- Spring WebSocket
- Maven for build management

**AI Service**
- Python FastAPI
- Scikit-learn for ML models
- Pandas for data processing
- Uvicorn as ASGI server

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Java 11+
- MongoDB
- Python 3.8+

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/croppulse.git
cd croppulse
```

2. **Setup Frontend**
```bash
cd Frontend
npm install
cp .env.example .env
npm run dev
```

3. **Setup Backend**
```bash
cd backend
# Set environment variables first (see SETUP.md)
mvn clean install
mvn spring-boot:run
```

4. **Setup AI Service**
```bash
cd croppulse-ai
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python train_model.py
python train_price_model.py
uvicorn main:app --reload --port 8000
```

**For detailed setup instructions, see [SETUP.md](./SETUP.md)**

## 📱 Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **AI Service Docs**: http://localhost:8000/docs

## 🔐 Security Notes

⚠️ **Important**: Never commit `.env` files or sensitive credentials to version control.

- Copy `.env.example` to `.env` and update with your values
- Use environment variables for sensitive data
- Keep API keys and database passwords secure
- For Gmail SMTP, use App Passwords: https://support.google.com/accounts/answer/185833

## 📚 Project Structure

```
croppulse/
├── Frontend/              # React + Vite UI
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API and utility services
│   │   └── context/      # React context
│   └── package.json
├── backend/              # Spring Boot API
│   ├── src/main/java/
│   │   └── com/croppulse/
│   │       ├── controller/
│   │       ├── service/
│   │       ├── model/
│   │       └── security/
│   └── pom.xml
├── croppulse-ai/         # Python AI Service
│   ├── main.py
│   ├── train_model.py
│   ├── train_price_model.py
│   └── requirements.txt
└── SETUP.md              # Setup instructions
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙋 Support

- 📖 See [SETUP.md](./SETUP.md) for detailed setup and troubleshooting
- 🐛 Create an issue for bugs
- 💡 Suggest features via discussions

## 👨‍💻 Author

Created with ❤️ for the agricultural community

---

**Happy farming! 🌾**
