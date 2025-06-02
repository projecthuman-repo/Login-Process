# 🔐 Login Process Backend

This repository contains the backend system for the Project Human City (PHC) platform. It manages user authentication across multiple integrated platforms such as SpotStitch, Lotus Learning, and Coquest.

---

## 🚀 Features

* 🔐 Email and password-based user registration and login
* 🧹 Support for external authentication (Google, Facebook, Instagram, Mastodon)
* 📄 MongoDB for user data persistence
* 📧 OTP-based registration through Nodemailer
* 🛡️ Secure session handling via JWT
* ✅ Validation using `express-validator` and `email-validator`
* ❌ XSS and NoSQL injection prevention
* ⚙️ Middleware support for logging (Morgan), security (Helmet), compression, and error handling

---

## 🧰 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Auth:** JWT, Nodemailer, bcrypt
* **Validation:** express-validator, email-validator
* **Frontend:** React.js (see `/frontend` folder)

---

## 📁 Project Structure

```
Login-Process-main/
├── backend/
│   ├── controllers/        # Logic handlers (e.g., auth.js)
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── utils/              # Helper functions (email, etc.)
│   └── server.js           # Backend entry point
│
├── frontend/               # React frontend
├── .env.example            # Sample environment config
├── package.json            # Project dependencies
```

---

## 🚪 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Login-Process-main.git
cd Login-Process-main
```

### 2. Install Dependencies

**Backend**

```bash
cd backend
npm install
```

**Frontend**

```bash
cd ../frontend
npm install
```

### 3. Configure Environment

Create a `.env` file in the `/backend` folder:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_email_password
```

### 4. Run the Application

**Backend**

```bash
cd backend
npm run dev
```

**Frontend**

```bash
cd ../frontend
npm start
```

---

## 🚩 API Overview

* `POST /api/register` – Register a new user
* `POST /api/verify-otp` – Verify OTP sent to email
* `POST /api/login` – User login with credentials

More routes and descriptions can be found in the [Wiki](https://github.com/your-repo/wiki).

---

## 📧 Contact

For support, reach out to the PHC Team or file an issue on GitHub.

---
