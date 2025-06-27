 
# Login Process Backend

This repository contains the backend code for the login system used in the Project Human City platform. It supports authentication and user management across multiple platforms including SpotStitch, Lotus Learning, and Coquest.

---

## 📌 Features

- Email + Password based user registration and login
- Support for external authentication (Google, Facebook, Instagram, Mastodon)
- MongoDB-based user persistence
- Email OTP registration support (via Nodemailer)
- JWT-based session handling
- Validation via express-validator and email-validator
- Manual XSS sanitization and MongoDB injection prevention
- Middleware for logging, security (Helmet), compression, and error handling

---

## ✅ Recent Updates (May 30, 2025)

- Upgraded and modernized all backend dependencies
- Replaced deprecated packages:
  - Removed `gulp-util`, `request`, `xss-clean`, and `deep-email-validator`
  - Replaced with safer/maintained alternatives like `email-validator` and manual sanitization
- Added manual XSS field-level protections in `/api/register`
- Added a test route `/api/register` for simplified local signup testing
- Removed obsolete or unsupported code
- Verified all changes through local testing (`curl` and terminal logs)

---

## 📁 Project Structure

```
backend/
├── app.js               # Main express app setup
├── server.js            # Entry point to start the server
├── config.env           # Environment variables
├── routes/              # Local auth routing (e.g. register)
├── controllers/         # Handles login, OAuth, user logic
├── models/              # Mongoose schemas
├── utils/               # Middleware, email sender, helpers
└── db/                  # MongoDB setup files
```

---

## ⚙️ Installation & Running Locally

### 1. Clone the repo

```bash
git clone https://github.com/projecthuman-repo/Login-Process.git
cd login-process/backend
```

### 2. Install dependencies

```bash
npm install
```

> If you face issues with dependency conflicts, use:
```bash
npm install --legacy-peer-deps
```

### 3. Set up `.env`

Place your environment variables in `config.env` like so:

```env
PORT=4000
LOCAL_URI="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<dbname>?"
SECRET_CAPTCHA_KEY="..."
EMAIL_USERNAME="..."
MASTODON_CLIENT_ID="..."
MASTODON_REDIRECT_URI="..."
```

### 4. Run the server

```bash
npm run dev
```

---

## 🧪 Test a local route

```bash
curl -X POST http://localhost:4000/api/register   -H "Content-Type: application/json"   -d '{"email": "test@example.com", "password": "123456"}'
```

Expected Response:

```json
{ "message": "User registered successfully!" }
```

---

## 🔐 Email OTP System (June 2025)

The backend now supports email-based OTP verification during registration, using **Gmail SMTP and Nodemailer**.

### ✉️ OTP Registration Flow

#### `POST /api/register`
Registers a user and sends a 6-digit OTP to their email.

**Payload:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

**Behavior:**
- Creates a user with hashed password
- Generates `otpCode` and `otpExpiresAt`
- Sends OTP to email using Nodemailer

**Response:**
```json
{ "message": "OTP sent to your email" }
```

---

#### `POST /api/verify-otp`
Verifies a user's OTP and activates the account.

**Payload:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Behavior:**
- Compares `otpCode`
- Confirms expiration
- Sets `isVerified` to true and clears OTP fields

**Response:**
```json
{ "message": "Email verified successfully!" }
```

---

#### `POST /api/resend-otp`
Resends OTP if the user is not yet verified.

**Payload:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{ "message": "OTP resent to your email" }
```

If user is already verified:
```json
{ "error": "User is already verified" }
```

---

### 🛠 Dev Notes
- Gmail App Password is used (stored in `config.env`):
  ```env
  EMAIL_USERNAME=testemail@projecthumancity.com
  EMAIL_PASSWORD=your_app_password
  EMAIL_HOST=smtp.gmail.com
  EMAIL_PORT=587
  ```
- OTPs are stored in `User` schema fields: `otpCode`, `otpExpiresAt`
- Utility modules: `utils/email.js`, `utils/otpUtil.js`
- Test routes via Postman or curl

---

## 🛠 Notes for Developers

- The route `/api/register` is a custom local route for OTP/email testing.
- We replaced `deep-email-validator` with `email-validator` due to performance and security.
- XSS sanitization must be manually applied in critical fields like `email`, `username`, `firstName`, etc.
- Make sure your `.env` never gets committed to version control. Use `.gitignore`.

---

## 🚧 Future Improvements

- Modularize OAuth logic across providers
- Add OAuth server support
- Improve test coverage (unit + integration)
- Add Docker support for consistent dev setup

---

## 👨‍💻 Contributors

- Anvit Bindra
- Mohammed Lakdawala

