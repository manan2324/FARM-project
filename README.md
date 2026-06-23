# FARM (Farmer Assistance & Resource Management) Project

A comprehensive, full-stack smart agriculture platform that integrates a modern web interface, Express backend, and machine learning models to help farmers maximize crop yield, diagnose plant diseases, and manage farm records effectively.

---

## 🚀 Key Features

*   **Crop Recommendation System**: Analyzes soil nutrients (Nitrogen, Phosphorus, Potassium) and environmental metrics (temperature, humidity, pH) to recommend the top 3 optimal crops using a Random Forest classifier.
*   **Plant Disease Diagnosis**: A PyTorch-based CNN (ResNet9) model that classifies 38 different plant leaf conditions/diseases from uploaded images and provides direct treatment recommendations.
*   **Farm & Plot Management**: Complete CRUD dashboard for farmers to record, edit, and track information about their farms and specific crop plots.
*   **Secure Authentication**: User sign-up, login, and route protection integrated with Firebase Authentication.
*   **Modern Dashboard**: Interactive, responsive user interface designed with React, Vite, TailwindCSS, and Material UI.

---

## 📂 Project Structure

```text
SIH-project/
├── frontend/             # React (Vite) + TailwindCSS + Material UI SPA
├── backend/              # Node.js + Express + MongoDB Server (Auth & Farm CRUD)
├── project/              # Python + FastAPI Service for Crop Recommendation (Random Forest)
├── disease_model/        # Python + FastAPI Service for Plant Disease Classification (PyTorch)
└── .gitignore            # Root git ignore file
```

---

## 🛠️ Technology Stack

| Component | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite, TailwindCSS, Material UI (MUI), Firebase Client SDK, Axios, React Router Dom |
| **Backend API** | Node.js, Express, MongoDB (Mongoose), Firebase Admin SDK, JWT, Helmet |
| **Crop Recommendation Model** | Python, FastAPI, Scikit-Learn, Pandas, Joblib |
| **Disease Detection Model** | Python, FastAPI, PyTorch, Torchvision, Pillow (PIL) |

---

## 📦 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18+)
*   [Python](https://www.python.org/) (v3.10+)
*   [MongoDB](https://www.mongodb.com/) (Local community edition or MongoDB Atlas URI)
*   A Firebase Project (Auth configured, service account JSON key downloaded)

---

### 1. Backend Setup (`/backend`)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and populate it:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Place your Firebase `serviceAccountKey.json` inside the `backend/config/` directory.
5. Start the backend server:
   *   Development mode (Nodemon): `npm run dev`
   *   Production mode: `npm start`

---

### 2. Frontend Setup (`/frontend`)

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Firebase by setting up `frontend/src/firebase/config.js` with your Firebase web app config credentials.
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The site will load locally (usually at `http://localhost:5173`).

---

### 3. Crop Recommendation API (`/project`)

1. Navigate to the project directory:
   ```bash
   cd ../project
   ```
2. Install Python dependencies:
   ```bash
   pip install fastapi uvicorn pandas scikit-learn joblib numpy
   ```
3. Run the train script if `pipeline.pkl` needs rebuilding:
   ```bash
   python main.py
   ```
4. Run the FastAPI development server:
   ```bash
   uvicorn new:app --port 8000 --reload
   ```
   API docs will be available at `http://127.0.0.1:8000/docs`.

---

### 4. Disease Detection API (`/disease_model`)

1. Navigate to the disease model directory:
   ```bash
   cd ../disease_model
   ```
2. Install Python dependencies (PyTorch, Torchvision, FastAPI, Pillow):
   ```bash
   pip install fastapi uvicorn torch torchvision pillow
   ```
3. Ensure the trained PyTorch model file (`plant_disease_model.pth`) is present in the `disease_model` folder.
4. Start the FastAPI development server:
   ```bash
   uvicorn main:app --port 8080 --reload
   ```
   API docs will be available at `http://127.0.0.1:8080/docs`.

---

## 🔒 Security & Best Practices

*   Sensitive credentials (like MongoDB URIs, JWT secrets, and Firebase service accounts) should **never** be committed. They are added to the `.gitignore`.
*   APIs use CORS middleware restricts/configures allowed origins appropriately for secure communication.
