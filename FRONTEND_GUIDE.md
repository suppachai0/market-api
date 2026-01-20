# Frontend Integration Guide - Market API

สำหรับ Frontend Developer ที่ต้อง integrate กับ Market API Backend

## 🚀 Quick Start

### API Base URL

```javascript
// Production (Vercel)
const API_BASE = "https://market-api-mu.vercel.app/api";

// Local Development
const API_BASE = "http://localhost:3000/api";
```

---

## 📖 Basic API Usage

### 1. ดึงข้อมูล Booking ทั้งหมด (GET)

```javascript
// ดึงหน้า 1 จำนวน 10 รายการ
fetch(`${API_BASE}/bookings?page=1&limit=10`)
  .then(res => res.json())
  .then(data => {
    console.log(data.data);           // รายการ booking
    console.log(data.pagination);     // ข้อมูล pagination
  });

// Filter by status
fetch(`${API_BASE}/bookings?status=pending`)

// Filter by shopType
fetch(`${API_BASE}/bookings?shopType=food`)

// Search (ค้นหา storeName, ownerName, email)
fetch(`${API_BASE}/bookings?search=กาแฟ`)

// Combine filters
fetch(`${API_BASE}/bookings?page=1&limit=10&status=pending&shopType=food&search=ร้าน`)
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "695fe3a537e85f39c5075b81",
      "storeName": "ร้านกาแฟ",
      "ownerName": "สมชาย",
      "phone": "0812345678",
      "email": "owner@email.com",
      "shopType": "food",
      "stallNumber": "A-01",
      "bookingDate": "2026-02-15T00:00:00.000Z",
      "status": "pending",
      "slipImage": {
        "url": "/uploads/1768923498196-payment.png",
        "publicId": "1768923498196-payment.png",
        "uploadedAt": "2026-01-20T15:30:00.000Z"
      },
      "createdAt": "2026-01-10T14:26:14.767Z",
      "updatedAt": "2026-01-10T14:26:14.767Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### 2. ดึงข้อมูล Booking เดียว (GET)

```javascript
fetch(`${API_BASE}/bookings/BOOKING_ID`)
  .then(res => res.json())
  .then(data => console.log(data.data));
```

---

### 3. สร้าง Booking ใหม่ (POST)

```javascript
const bookingData = {
  storeName: "ร้านกาแฟ",           // ชื่อร้าน
  ownerName: "สมชาย",              // ชื่อเจ้าของ
  phone: "0812345678",             // โทรศัพท์ (10 หลัก, เริ่มต้นด้วย 0)
  email: "owner@email.com",        // อีเมล
  shopType: "food",                // food, cloth, gift, service, other
  stallNumber: "A-01",             // หมายเลขสถาน (เช่น A-01, B-02)
  bookingDate: "2026-02-15"        // วันจอง (YYYY-MM-DD)
};

fetch(`${API_BASE}/bookings`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(bookingData)
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log("Booking created:", data.data._id);
    } else {
      console.error("Error:", data.error);
    }
  });
```

---

### 4. อัปเดต Booking (PUT) - ต้องมี Token

```javascript
// ต้อง login ก่อนเพื่อได้ token
const token = localStorage.getItem("token");

fetch(`${API_BASE}/bookings/BOOKING_ID`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({
    status: "approved",  // pending, approved, rejected, completed
    storeName: "ร้านกาแฟ 2"  // เปลี่ยนชื่อ
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log("Booking updated");
    }
  });
```

---

### 5. ลบ Booking (DELETE) - ต้องมี Token

```javascript
const token = localStorage.getItem("token");

fetch(`${API_BASE}/bookings/BOOKING_ID`, {
  method: "DELETE",
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log("Booking deleted");
    }
  });
```

---

## 🔐 Authentication

### ก. Admin Login

```javascript
fetch(`${API_BASE}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@sisaket.go.th",
    password: "admin123"
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const token = data.data.token;
      localStorage.setItem("token", token);
      console.log("Admin login success!");
    }
  });
```

---

### ข. User Signup

```javascript
fetch(`${API_BASE}/auth/signup`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "john_doe",
    email: "john@email.com",
    password: "password123",
    fullName: "John Doe"
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const token = data.data.token;
      localStorage.setItem("token", token);
      console.log("Signup success!");
    }
  });
```

---

### ค. User Login

```javascript
fetch(`${API_BASE}/auth/user-login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "john@email.com",
    password: "password123"
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const token = data.data.token;
      localStorage.setItem("token", token);
      console.log("Login success!");
    }
  });
```

---

## 📸 Image Upload (สำหรับ Payment Slip)

```javascript
// HTML
// <input type="file" id="fileInput" accept="image/*">
// <button onclick="uploadImage()">Upload</button>

async function uploadImage() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file");
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("File size must be less than 5MB");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      const imageUrl = data.data.url;    // "/uploads/123456-file.png"
      const publicId = data.data.publicId; // "123456-file.png"
      
      console.log("Image uploaded:", imageUrl);
      
      // ตอนนี้ใช้ imageUrl เพื่ออัปเดต booking
      // PATCH booking ด้วย slipImage
    } else {
      alert("Upload failed: " + data.error);
    }
  } catch (error) {
    console.error("Upload error:", error);
  }
}
```

---

## 📋 Validation Rules

| Field | Rules | Example |
|-------|-------|---------|
| **phone** | 10 digits, starts with 0 | 0812345678 |
| **email** | Valid email | user@email.com |
| **shopType** | food, cloth, gift, service, other | food |
| **status** | pending, approved, rejected, completed | pending |
| **stallNumber** | Any format | A-01, B-02 |
| **bookingDate** | YYYY-MM-DD | 2026-02-15 |
| **password** | Min 6 characters | Pass@123 |

---

## 🔍 Error Handling

```javascript
fetch(`${API_BASE}/bookings`)
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      // ✅ Success
      console.log(data.data);
    } else {
      // ❌ Error
      console.error("Error:", data.error);
      console.error("Status code:", data.statusCode);
    }
  })
  .catch(error => {
    console.error("Network error:", error);
  });
```

### Common Errors

| Error | Meaning | Solution |
|-------|---------|----------|
| Unauthorized | Missing/invalid token | Login first |
| Not Found | Booking ID doesn't exist | Check ID |
| Bad Request | Invalid input | Validate data |
| File too large | Upload file > 5MB | Use smaller image |

---

## ⚡ HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Not Found |
| 500 | Server Error |

---

## 💡 React Example

```jsx
import { useState, useEffect } from "react";

export default function BookingForm() {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    storeName: "",
    ownerName: "",
    phone: "",
    email: "",
    shopType: "food",
    stallNumber: "",
    bookingDate: ""
  });

  // ดึงข้อมูล
  useEffect(() => {
    fetch("http://localhost:3000/api/bookings?page=1&limit=10")
      .then(res => res.json())
      .then(data => setBookings(data.data));
  }, []);

  // สร้าง booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch("http://localhost:3000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    if (result.success) {
      alert("Booking created!");
      setFormData({ /* reset */ });
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div>
      <h1>ยื่นจองสถาน</h1>
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ชื่อร้าน"
          value={formData.storeName}
          onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="ชื่อเจ้าของ"
          value={formData.ownerName}
          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="โทรศัพท์"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="อีเมล"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <select
          value={formData.shopType}
          onChange={(e) => setFormData({ ...formData, shopType: e.target.value })}
        >
          <option value="food">ร้านอาหาร</option>
          <option value="cloth">เสื้อผ้า</option>
          <option value="gift">ของขวัญ</option>
          <option value="service">บริการ</option>
          <option value="other">อื่นๆ</option>
        </select>
        <input
          type="text"
          placeholder="หมายเลขสถาน (เช่น A-01)"
          value={formData.stallNumber}
          onChange={(e) => setFormData({ ...formData, stallNumber: e.target.value })}
          required
        />
        <input
          type="date"
          value={formData.bookingDate}
          onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
          required
        />
        <button type="submit">ยื่นจอง</button>
      </form>

      {/* List */}
      <h2>รายการจอง</h2>
      {bookings.map(booking => (
        <div key={booking._id}>
          <h3>{booking.storeName}</h3>
          <p>เจ้าของ: {booking.ownerName}</p>
          <p>สถานะ: {booking.status}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔌 Endpoints Summary

| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/bookings` | ❌ |
| GET | `/api/bookings/:id` | ❌ |
| POST | `/api/bookings` | ❌ |
| PUT | `/api/bookings/:id` | ✅ |
| DELETE | `/api/bookings/:id` | ✅ |
| POST | `/api/auth/login` | ❌ |
| POST | `/api/auth/signup` | ❌ |
| POST | `/api/auth/user-login` | ❌ |
| POST | `/api/upload` | ❌ |

---

## 📞 Support

สำหรับคำถามหรือปัญหา ติดต่อ Backend Developer

**API Status**: ✅ Ready for Production
