
# Login Process Backend

This repository contains the backend code for the login and Single Sign-On (SSO) system used in the Project Human City platform. It supports authentication and user management across multiple PHC applications, including SpotStitch, Lotus Learning, and CoQuest.

---

## 📌 Features

- Email + Password based registration and login  
- OTP-based email verification (Nodemailer with Gmail SMTP)  
- OAuth2 Authorization Server (`authorization_code` grant)  
- Unified login: Social (Google, Facebook) + PHC Email  
- JWT-based session handling  
- Password-reset via email link  
- Self-service account deletion  
- MongoDB-based user persistence (Mongoose)  
- XSS and MongoDB injection prevention  
- Middleware for logging, security (Helmet), compression, and error handling  

---

## ✅ Recent Updates (July 2025)

- **OAuth2 SSO implemented:**  
  - `/oauth/authorize` → issues code (after PHC or social login)  
  - `/oauth/token` → exchanges code for access token  
- **Unified login across social/email:**  
  - Google and Facebook users now receive OAuth tokens directly  
- **Client App Registration:**  
  - `/api/clients/register` → generates `client_id` and `client_secret`  
- **Mastodon removed:**  
  - All Mastodon OAuth dependencies are fully removed  
- **Updated documentation:**  
  - OAuth2 integration guide with curl examples available in `PHC-OAuth2-Integration.md`

---

## 📁 Project Structure

```
backend/
├── app.ts                    # Express app setup
├── server.ts                 # Starts the server
├── config.env.example        # Environment variables
├── routes/                   # Auth and OAuth routes
├── controllers/              # Auth, OAuth, social logins
├── models/                   # Mongoose schemas
├── utils/                    # Helpers (email, OTP, OAuth utils)
└── db/                       # MongoDB connection setup
```

---

## ⚙️ Installation & Running Locally

### 1. Clone the repo

```bash
git clone https://github.com/projecthuman-repo/Login-Process.git
cd Login-Process/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy the example config:

```bash
cp config.env.example config.env
```

Update SMTP email, database URI, JWT secret, and OAuth client credentials.

---

### 4. Run the server

```bash
npm run dev
```

Server runs at `http://localhost:4000`.

---

## 🧪 OAuth2 Flow Overview

| Step | Endpoint | Description |
|------|----------|-------------|
| 1️⃣ | `/api/clients/register` | App registers as OAuth client |
| 2️⃣ | `/oauth/authorize` | User authorizes and gets code |
| 3️⃣ | `/oauth/token` | Exchange code for access token |

---

## 🧪 Authentication API Test Plan

| Method  | Path                     | Description |
|----------|------------------------|-------------|
| POST    | `/api/auth/register`    | Register user & send OTP |
| POST    | `/api/auth/verify-otp`  | Verify OTP & activate |
| POST    | `/api/auth/login`       | Login & get JWT |
| POST    | `/api/googleUsers`      | Google login + OAuth token |
| POST    | `/api/facebookUsers`    | Facebook login + OAuth token |
| POST    | `/oauth/token`          | Exchange code for token |

---

## 🛠 Notes for Developers

- **OAuth2 Token Format:**  
  Access tokens are JWTs signed with `JWT_SECRET`.  
- **Refresh Tokens:**  
  Issued and stored but refresh flow is optional for now.
- **Social logins:**  
  Google/Facebook login creates user if not found, otherwise issues OAuth tokens.

---

## 🚧 Future Improvements

- Add refresh token grant endpoint (optional next step)  
- Add frontend examples for `/oauth/authorize` flow  
- Write Jest & Supertest automated tests  

---

## 👨‍💻 Contributors

- **Anvit Bindra** — OAuth2 SSO + Backend Modernization  
- **Mohammed Lakdawala** — System Integration  
