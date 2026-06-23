# 🌾 FARM — Farmer Assistance & Resource Management

A comprehensive, full-stack smart agriculture platform that empowers farmers with AI-driven crop recommendations, plant disease diagnosis, real-time weather insights, and complete farm management — all through a modern, responsive web interface.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🌱 Crop Recommendation** | Analyzes soil nutrients (N, P, K), temperature, humidity, and pH to recommend the **top 3 optimal crops** with confidence scores using a Random Forest classifier. |
| **🔬 Plant Disease Diagnosis** | Upload a leaf image and a **ResNet9 CNN** classifies it across **38 plant conditions/diseases**, returning the diagnosis along with actionable treatment recommendations. |
| **🧪 Fertilizer Guidance** | Provides fertilizer recommendations based on soil composition and target crop requirements. |
| **🏡 Farm & Plot Management** | Full CRUD dashboard — create, view, edit, and delete farms and their individual crop plots with soil type, location, and size tracking. |
| **🤖 AI Chatbot** | Gemini AI-powered conversational assistant for on-demand farming advice and queries. |
| **📈 Market Insights** | Browse current market information to make informed selling and purchasing decisions. |
| **🌦️ Weather Tracking** | Live weather data (temperature, humidity, wind speed, sunrise) synced per-farm and stored for reference. |
| **📚 Crop Guidance** | Dedicated crop guidance hub for learning best practices and seasonal tips. |
| **🔐 Secure Authentication** | Phone-based OTP sign-up and login via **Firebase Authentication** with protected routes. |
| **🌐 Multi-Language Support** | Language selection page allowing farmers to use the platform in their preferred language. |
| **💬 Feedback System** | Built-in feedback page for users to share suggestions and report issues. |
| **❓ Help & Support** | Comprehensive help and support center with FAQs and contact information. |

---

## 📂 Project Structure

```text
FARM-project/
├── frontend/             # React 19 (Vite) + TailwindCSS 4 + Material UI 7 SPA
│   ├── src/
│   │   ├── components/       # Reusable components (ProtectedRoute, etc.)
│   │   ├── firebase/         # Firebase config & AuthContext
│   │   ├── landing_page/     # All page modules
│   │   │   ├── Chatbot/          # AI Chatbot (Gemini)
│   │   │   ├── CropGuide/        # Crop guidance hub
│   │   │   ├── DiseaseTest/      # Disease upload & results
│   │   │   ├── Farm/             # Farm CRUD pages
│   │   │   ├── Feedback/         # User feedback
│   │   │   ├── Home/             # Dashboard home
│   │   │   ├── Market/           # Market insights
│   │   │   └── SoilTest/         # Crop & fertilizer recommendations
│   │   ├── App.jsx           # Route definitions
│   │   └── main.jsx          # Entry point
│   └── .env.example          # Required environment variables
│
├── backend/              # Node.js + Express + MongoDB API server
│   ├── middleware/           # Firebase token verification
│   ├── models/               # Mongoose schemas (User, Farm, Plot)
│   ├── routes/               # REST API routes (farms CRUD + weather)
│   ├── index.js              # Express entry point
│   └── .env.example          # Required environment variables
│
├── project/              # Python + FastAPI — Crop Recommendation Service
│   ├── main.py               # Model training script
│   ├── new.py                # FastAPI prediction server
│   ├── Crop_recommendation.csv  # Training dataset
│   └── pipeline.pkl*         # Trained model (git-ignored)
│
├── disease_model/        # Python + FastAPI — Disease Classification Service
│   ├── main.py               # FastAPI server with ResNet9 model
│   └── plant_disease_model.pth*  # Trained PyTorch model (git-ignored)
│
├── .gitignore
└── README.md
```

> \* Model files (`*.pkl`, `*.pth`) are **git-ignored** due to their size. See setup instructions below for details.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 7, TailwindCSS 4, Material UI (MUI) 7, Firebase Client SDK 12, Axios, React Router Dom 7 |
| **Backend API** | Node.js, Express 4, MongoDB (Mongoose 7), Firebase Admin SDK 13, JWT, Helmet, Morgan, Express Validator |
| **Crop Recommendation** | Python, FastAPI, Scikit-Learn, Pandas, NumPy, Joblib |
| **Disease Detection** | Python, FastAPI, PyTorch, Torchvision, Pillow (PIL) |
| **Auth & Cloud** | Firebase Authentication (Phone/OTP), Google Gemini AI |
| **External APIs** | Weather API, Gemini API |

---

## 📦 Getting Started

### Prerequisites

Ensure the following are installed:

- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) v3.10+
- [MongoDB](https://www.mongodb.com/) (local Community Edition or a MongoDB Atlas cluster)
- A [Firebase](https://firebase.google.com/) project with **Phone Authentication** enabled
- A [Gemini API key](https://ai.google.dev/) (for the AI chatbot)
- A Weather API key (for live weather data)

---

### 1️⃣ Backend Setup (`/backend`)

```bash
cd backend
npm install
```

Create a `.env` file by copying the example and filling in your credentials:

```bash
cp .env.example .env
```

Required variables in `.env`:

```env
# MongoDB connection string
MONGODB_URL=mongodb://127.0.0.1:27017/sih_project

# Server port
PORT=5000

# Firebase Admin SDK credentials (from Firebase Console > Service Accounts)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_CLIENT_EMAIL=your_client_email@your_project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

Start the server:

```bash
# Development (auto-reload with Nodemon)
npm run dev

# Production
npm start
```

The backend will be available at `http://localhost:5000`.

---

### 2️⃣ Frontend Setup (`/frontend`)

```bash
cd frontend
npm install
```

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Required variables in `.env`:

```env
# Weather API
VITE_WEATHER_API_KEY=your_weather_api_key

# Gemini AI API
VITE_GEMINI_API_KEY=your_gemini_api_key

# Firebase Web SDK config (from Firebase Console > Project Settings > Web App)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

### 3️⃣ Crop Recommendation API (`/project`)

```bash
cd project
pip install fastapi uvicorn pandas scikit-learn joblib numpy
```

If `pipeline.pkl` needs to be rebuilt (first-time setup or retraining):

```bash
python main.py
```

Start the FastAPI server:

```bash
uvicorn new:app --port 8000 --reload
```

- API: `http://127.0.0.1:8000`
- Swagger docs: `http://127.0.0.1:8000/docs`

---

### 4️⃣ Disease Detection API (`/disease_model`)

```bash
cd disease_model
pip install fastapi uvicorn torch torchvision pillow
```

> **Note:** Ensure the trained model file `plant_disease_model.pth` is present in the `disease_model/` directory. This file is too large for Git and must be obtained separately (e.g., from a shared drive or by running the training pipeline).

Start the FastAPI server:

```bash
uvicorn main:app --port 8080 --reload
```

- API: `http://127.0.0.1:8080`
- Swagger docs: `http://127.0.0.1:8080/docs`

---

## 🌐 API Reference

### Backend REST API (`localhost:5000`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | ✗ | Health check |
| `GET` | `/user` | ✓ | Get authenticated user profile |
| `POST` | `/user` | ✓ | Create or update user profile |
| `GET` | `/farms` | ✓ | List all farms for authenticated user |
| `GET` | `/farms/:id` | ✓ | Get a specific farm with plots |
| `POST` | `/farms` | ✓ | Create a new farm (with optional plots) |
| `PUT` | `/farms/:id` | ✓ | Update a farm and its plots |
| `PUT` | `/farms/:id/weather` | ✗ | Update weather data for a farm |
| `DELETE` | `/farms/:id` | ✓ | Delete a farm and all its plots |

### Crop Recommendation API (`localhost:8000`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check |
| `POST` | `/predict` | Predict top 3 crops from soil/weather data (N, P, K, temperature, humidity, pH) |

### Disease Detection API (`localhost:8080`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/predict` | Upload a leaf image → returns disease class, label, and treatment solution |

---

## 🗺️ Frontend Routes

| Path | Page | Protected |
| :--- | :--- | :---: |
| `/language` | Language selection | ✗ |
| `/login` | Phone OTP login | ✗ |
| `/userinfo` | User profile setup | ✗ |
| `/` | Farm dashboard (home) | ✓ |
| `/farm/:id` | Individual farm view | ✓ |
| `/farm/:id/edit` | Edit farm details | ✓ |
| `/add-farm` | Create a new farm | ✓ |
| `/farm/:id/soil-testing` | Soil test input | ✓ |
| `/farm/:id/soil-testing/crop` | Crop recommendations | — |
| `/farm/:id/soil-testing/fertilizer` | Fertilizer recommendations | — |
| `/farm/:id/disease-testing` | Disease image upload | ✓ |
| `/farm/:id/disease-testing/result` | Disease diagnosis result | ✓ |
| `/chatbot` | AI chatbot (Gemini) | ✓ |
| `/market` | Market insights | ✓ |
| `/crop-guidance` | Crop guidance hub | ✓ |
| `/feedback` | User feedback form | ✓ |
| `/help` | Help & support center | ✓ |

---

## 🔒 Security & Best Practices

- **Environment variables** — All secrets (MongoDB URI, Firebase keys, API keys) are stored in `.env` files and **never committed** to version control (see `.gitignore`).
- **Firebase token verification** — The backend middleware validates Firebase ID tokens on every protected request.
- **CORS** — All services configure CORS middleware. For production, restrict `allow_origins` to your deployed frontend domain.
- **Helmet** — The Express backend uses Helmet to set secure HTTP headers.
- **Input validation** — Express Validator is available for request body validation.
- **Model files excluded** — Large ML model files (`.pth`, `.pkl`) are git-ignored to keep the repository lightweight.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
