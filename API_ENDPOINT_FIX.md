# API Endpoint Fix - Error 500 on /api/auth/register1

## ⚠️ Problem

Frontend เรียก `/api/auth/register1` แต่ได้ **error 500** 

ตัวอย่างจากรูป:
```
POST /api/auth/register1 → 500 (Internal Server Error)
```

## ✅ Solution

**เปลี่ยนจาก** `/api/auth/register1` **เป็น** `/api/auth/signup`

---

## 📝 Correct API Endpoints

### Authentication Endpoints ที่มีใน API:

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/auth/signup` | POST | User registration | ✅ ใช้ได้ |
| `/api/auth/user-login` | POST | User login | ✅ ใช้ได้ |
| `/api/auth/login` | POST | Admin login | ✅ ใช้ได้ |

---

## 🔧 Fix Code Example

### ❌ WRONG - Current Code (causing error)

```javascript
// ❌ ไม่มี endpoint นี้
fetch("http://localhost:3000/api/auth/register1", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "testuser",
    email: "test@test.com",
    password: "password123",
    fullName: "Test User"
  })
})
```

### ✅ CORRECT - Fixed Code

```javascript
// ✅ ใช้ signup แทน
fetch("http://localhost:3000/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "testuser",
    email: "test@test.com",
    password: "password123",
    fullName: "Test User"
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log("✅ Signup successful!");
      localStorage.setItem("token", data.data.token);
      // Redirect to login or dashboard
    } else {
      console.error("❌ Error:", data.error);
    }
  })
  .catch(error => console.error("Network error:", error));
```

---

## 📋 Request/Response Format

### POST /api/auth/signup

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@email.com",
  "password": "pass123456",
  "fullName": "John Doe"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@email.com",
      "fullName": "John Doe"
    }
  },
  "message": "User registered successfully"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Email already exists",
  "statusCode": 400
}
```

---

## 🔍 Search and Replace

### If Using React Component:

**Search for:**
```javascript
/api/auth/register1
```

**Replace with:**
```javascript
/api/auth/signup
```

---

## 📞 Other Auth Endpoints

### User Login - POST /api/auth/user-login

```javascript
fetch("http://localhost:3000/api/auth/user-login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "john@email.com",
    password: "pass123456"
  })
})
```

### Admin Login - POST /api/auth/login

```javascript
fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@sisaket.go.th",
    password: "admin123"
  })
})
```

---

## 🧪 Test in Browser Console

```javascript
// Quick test
fetch("http://localhost:3000/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "testuser123",
    email: "test" + Date.now() + "@test.com",
    password: "Test@12345",
    fullName: "Test User"
  })
})
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

---

## ✨ Summary

| What | From | To |
|------|------|-----|
| **Endpoint** | `/api/auth/register1` ❌ | `/api/auth/signup` ✅ |
| **Status** | 500 Error | Working |
| **Fields** | Same | Same (username, email, password, fullName) |

---

**ตรวจสอบให้แน่ใจว่า:**
- ✅ API Base URL ถูก (localhost:3000 หรือ Vercel URL)
- ✅ Method คือ POST
- ✅ Headers มี Content-Type: application/json
- ✅ Body มีฟิลด์ที่ถูกต้อง
