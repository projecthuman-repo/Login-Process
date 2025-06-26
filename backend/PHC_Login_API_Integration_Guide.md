
# 🔗 PHC Login-Process API Integration Guide (Frontend-Facing)

_Last updated: June 26, 2025_

This guide is for frontend developers (Coquest, SpotStitch, Lotus Learning) integrating the PHC login system with email + password + OTP-based verification.

---

## 🌐 Base URL

For local testing:
```
http://localhost:4000/api
```

For production (TBD):
```
https://login.projecthumancity.com/api
```

---

## 📝 1. Register a User

**Endpoint:**
```
POST /register
```

**Payload:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

**Expected Behavior:**
- Creates a new user
- Generates a 6-digit OTP
- Sends OTP to the provided email

**Sample Response:**
```json
{ "message": "OTP sent to your email" }
```

---

## 🔐 2. Verify Email with OTP

**Endpoint:**
```
POST /verify-otp
```

**Payload:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Expected Behavior:**
- Verifies OTP and activates the user
- Flags `isVerified = true` in the database

**Sample Response:**
```json
{ "message": "Email verified successfully!" }
```

---

## 🔁 3. Resend OTP (If Needed)

**Endpoint:**
```
POST /resend-otp
```

**Payload:**
```json
{
  "email": "user@example.com"
}
```

**Behavior:**
- Resends OTP if user is unverified
- Returns error if already verified

**Sample Success:**
```json
{ "message": "OTP resent to your email" }
```

**Sample Error:**
```json
{ "error": "User is already verified" }
```

---

## 📦 Optional: Login (If Route is Enabled)

**Endpoint:**
```
POST /login
```

**Payload:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

**Response (if JWT enabled):**
```json
{
  "token": "JWT_TOKEN_HERE",
  "user": {
    "email": "user@example.com",
    "isVerified": true
  }
}
```

> 🔒 Only works if the user is verified.

---

## 💡 Notes for Frontend Devs

- Always **wait for OTP verification** before enabling login or onboarding features.
- Use loading states on `register`, `verify-otp`, and `resend-otp` requests.
- Validate email format before sending to `/register`.
- Handle all error responses (400, 404) gracefully in the UI.
- Use environment-based config for API base URLs (`process.env.REACT_APP_API_URL`, etc).

---

## 📥 Questions / Issues?

Contact the backend team on Slack:
- `@Anvit Bindra`
- `@Mohammed`
