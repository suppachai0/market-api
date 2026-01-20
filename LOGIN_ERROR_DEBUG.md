# Login Error Debug Guide - "เกิดข้อผิดพลาดในระบบ"

## ⚠️ Error: "เกิดข้อผิดพลาดในระบบ"

### Status: 🔴 API Server ✅ Working | Frontend ❌ Issue

API server ทำงาน (POST /api/auth/login → 200) แต่ Frontend ยังได้ error

---

## 🔍 Possible Causes

### 1. ❌ API Base URL ผิด

**Check your code:**

```javascript
// ❌ WRONG - Using production URL locally
const API_BASE = "https://market-api-mu.vercel.app/api";

// ✅ CORRECT - Local development
const API_BASE = "http://localhost:3000/api";
```

### 2. ❌ CORS Issue

API ตัวเราสนับสนุน CORS แล้ว แต่ตรวจสอบว่า headers ถูกไหม

```javascript
// ✅ CORRECT
headers: {
  "Content-Type": "application/json"
  // NO need to add Authorization for login
}
```

### 3. ❌ Account ยังไม่สร้าง

ต้องสร้าง admin account ก่อน:

```bash
# Open browser
http://localhost:3000/admin-creator.html

# Then click "สร้างบัญชี Admin"
```

### 4. ❌ Email/Password ผิด

ลอง default creds:
- **Email:** admin@sisaket.go.th
- **Password:** admin123

---

## ✅ Step-by-Step Fix

### Step 1: Verify API Server Running

```bash
# In terminal, check if containers running
docker ps

# Should see market-nextjs and market-mongo
```

### Step 2: Test API Endpoint Directly

**In Browser Console (F12):**

```javascript
// Test login
const response = await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@sisaket.go.th",
    password: "admin123"
  })
});

const data = await response.json();
console.log("Response:", data);
console.log("Status:", response.status);
console.log("Headers:", response.headers);
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc..."
  }
}
```

---

### Step 3: Check Frontend Code

**Find login.jsx/page.jsx and verify:**

```javascript
// ❌ BAD
const API_URL = "https://market-api-mu.vercel.app"; // Wrong for local dev

// ✅ GOOD
const API_URL = "http://localhost:3000"; // or use env variable
```

**Look for:**
```javascript
// Check if API_BASE is set correctly
console.log("API_BASE:", API_BASE);

// Check if fetch request is correct
fetch(`${API_BASE}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
})
```

---

### Step 4: Create Admin Account

If admin doesn't exist:

**Option A - Web UI (Easy):**
```
Open: http://localhost:3000/admin-creator.html
Click: สร้างบัญชี Admin
```

**Option B - Browser Console:**
```javascript
const res = await fetch("http://localhost:3000/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "admin_sisaket",
    email: "admin@sisaket.go.th",
    password: "admin123",
    fullName: "Admin Sisaket"
  })
});
const data = await res.json();
console.log(data);
```

---

### Step 5: Test Login Again

```javascript
// After creating admin, try login
const loginRes = await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@sisaket.go.th",
    password: "admin123"
  })
});

const loginData = await loginRes.json();
console.log("Login response:", loginData);

if (loginData.success) {
  console.log("✅ Login successful!");
  console.log("Token:", loginData.data.token);
} else {
  console.log("❌ Login failed:", loginData.error);
}
```

---

## 🎯 Common Frontend Issues

### Issue 1: Using Production API Locally

```javascript
// ❌ WRONG
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://market-api-mu.vercel.app/api";

// ✅ CORRECT
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
```

### Issue 2: Missing Trailing API Path

```javascript
// ❌ WRONG
fetch("http://localhost:3000/auth/login")

// ✅ CORRECT
fetch("http://localhost:3000/api/auth/login")
```

### Issue 3: Not Checking Response Status

```javascript
// ❌ WRONG
const data = await response.json();
// Doesn't check response.ok

// ✅ CORRECT
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}
const data = await response.json();
```

### Issue 4: Silent Error Catch

```javascript
// ❌ BAD - Hides error
try {
  // ...
} catch (error) {
  console.error("เกิดข้อผิดพลาดในระบบ"); // Generic message!
}

// ✅ GOOD - Log actual error
try {
  // ...
} catch (error) {
  console.error("Login failed:", error);
  console.error("Error details:", error.message, error.stack);
}
```

---

## 📋 Checklist

- [ ] API Server running (`docker ps` shows containers)
- [ ] API Base URL correct in frontend code
- [ ] CORS headers present in response
- [ ] Admin account created (check DB or use admin-creator.html)
- [ ] Email & Password correct
- [ ] No typos in endpoint URL (`/api/auth/login`)
- [ ] Browser console shows actual error details (not generic message)
- [ ] Network tab shows 200 status from API
- [ ] Response JSON has `success: true`

---

## 🆘 If Still Not Working

### Enable Debug Logging

Update frontend login function:

```javascript
async function login(email, password) {
  const apiUrl = `http://localhost:3000/api/auth/login`;
  
  console.log("🔓 Attempting login...");
  console.log("API URL:", apiUrl);
  console.log("Email:", email);
  
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers));
    
    const data = await response.json();
    console.log("Response body:", data);
    
    if (data.success) {
      console.log("✅ Login successful!");
      localStorage.setItem("token", data.data.token);
      return data.data;
    } else {
      console.error("❌ Login failed:", data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Error stack:", error.stack);
    throw error;
  }
}
```

Then check **Browser Console (F12)** for detailed logs.

---

## 📞 Quick Test

Run in browser console:

```javascript
// 1. Test API connectivity
await fetch("http://localhost:3000/api/bookings").then(r => r.json()).then(d => console.log("API OK:", d.success))

// 2. Test admin account exists
const loginTest = await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@sisaket.go.th", password: "admin123" })
}).then(r => r.json());
console.log("Login test:", loginTest);
```

**If both pass → Issue is in Frontend code**
**If either fails → Check API/Database**
