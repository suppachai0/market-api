
# Market API - Market Stall Booking System

ระบบ RESTful API สำหรับจัดการการจองสถานที่ตั้งร้านค้าในตลาด พัฒนาด้วย Next.js, MongoDB Atlas, และ Vercel

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)

## 🌐 Live Demo

```
API Base URL: https://market-api-n9paign16-suppchai0-projects.vercel.app/api/bookings
```

## 📋 คำบรรยาย

Market API เป็น **Backend API Service** สำหรับจัดการการจองสถานที่ตั้งร้านค้าในตลาด
- ✅ **REST API** - สำหรับสร้าง อ่าน แก้ไข ลบ booking
- ✅ **MongoDB Atlas** - ฐานข้อมูล Cloud พร้อมใช้
- ✅ **Deployed on Vercel** - สามารถเข้าถึงจาก Internet ได้
- ✅ **Backend Only** - เพื่อนจะ integrate ในส่วน Frontend ของตนเอง

## 🛠️ เทคโนโลยี

| เทคโนโลยี | รายละเอียด |
|----------|-----------|
| **Framework** | Next.js 16.1.1 (App Router) |
| **Runtime** | Node.js 20 |
| **Database** | MongoDB Atlas (Cloud) |
| **ORM** | Mongoose 8.0.0 |
| **Hosting** | Vercel |
| **Containerization** | Docker & Docker Compose |
| **Styling** | Tailwind CSS |

## 📦 ข้อกำหนดเบื้องต้น (สำหรับ Local Development)

- Docker Desktop
- Node.js 20+
- npm หรือ yarn

## 🚀 Quick Start

### ตัวเลือก 1: ใช้ Live API (เพื่อนของคุณ)

```javascript
// เรียก API จาก Vercel
const API_URL = "https://market-api-n9paign16-suppchai0-projects.vercel.app/api/bookings";

// ดึงข้อมูล
fetch(API_URL)
  .then(res => res.json())
  .then(data => console.log(data));
```

### ตัวเลือก 2: รัน Local Development

```bash
# Clone repository
git clone https://github.com/suppchai0/market-api.git
cd market-api

# สร้าง .env.local
echo "MONGODB_URI=mongodb+srv://suppachai4454_db_user:PASSWORD@cluster0.kcllz2s.mongodb.net/market-api?appName=Cluster0" > .env.local

# รัน Docker
docker-compose up -d

# เข้า http://localhost:3000/api/bookings
```

### ตัวเลือก 3: Deploy เอง

```bash
# Push ขึ้น GitHub
git push origin main

# ไป Vercel
# 1. ไปที่ vercel.com/new
# 2. Import repository
# 3. Add MONGODB_URI environment variable
# 4. Deploy
```

---

## 📡 API Endpoints

### 1️⃣ GET - ดึงข้อมูลการจองทั้งหมด

```bash
GET /api/bookings

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "storeName": "ร้านกาแฟ",
      "ownerName": "สมชาย",
      "phone": "0812345678",
      "email": "test@example.com",
      "shopType": "food",
      "stallNumber": "A01",
      "bookingDate": "2025-01-15",
      "status": "pending",
      "createdAt": "2025-01-09T...",
      "updatedAt": "2025-01-09T..."
    }
  ]
}
```

### 2️⃣ POST - สร้างการจองใหม่

```bash
POST /api/bookings

Body:
{
  "storeName": "ร้านกาแฟ",
  "ownerName": "สมชาย",
  "phone": "0812345678",
  "email": "test@example.com",
  "shopType": "food",
  "stallNumber": "A01",
  "bookingDate": "2025-01-15"
}

Response: 201 Created
{
  "success": true,
  "data": { ...booking object }
}
```

### 3️⃣ GET - ดึงข้อมูลการจองเดียว

```bash
GET /api/bookings/:id

Response:
{
  "success": true,
  "data": { ...booking object }
}
```

### 4️⃣ PUT - อัพเดทสถานะการจอง

```bash
PUT /api/bookings/:id

Body:
{
  "status": "approved"  // or "rejected" or "pending"
}

Response:
{
  "success": true,
  "data": { ...updated booking }
}
```

### 5️⃣ DELETE - ลบการจอง

```bash
DELETE /api/bookings/:id

Response:
{
  "success": true,
  "data": { deletedCount: 1 }
}
```

---

## 📊 Database Schema

```javascript
Booking {
  _id: ObjectId,              // Auto-generated
  storeName: String,          // ชื่อร้าน (บังคับ)
  ownerName: String,          // ชื่อเจ้าของ (บังคับ)
  phone: String,              // เบอร์โทร 10 หลัก (บังคับ)
  email: String,              // อีเมล (บังคับ, มี validation)
  shopType: String,           // food, clothing, goods, other (บังคับ)
  stallNumber: String,        // หมายเลขสถาน (บังคับ)
  bookingDate: Date,          // วันที่จอง (บังคับ)
  status: String,             // pending, approved, rejected (default: pending)
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

---

## 💻 ตัวอย่าง Integration

### React Component

```javascript
import { useState, useEffect } from 'react';

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const API_URL = "https://market-api-n9paign16-suppchai0-projects.vercel.app/api/bookings";

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setBookings(data.data));
  }, []);

  return (
    <div>
      <h1>Market Bookings</h1>
      {bookings.map(booking => (
        <div key={booking._id}>
          <h3>{booking.storeName}</h3>
          <p>Owner: {booking.ownerName}</p>
          <p>Status: {booking.status}</p>
        </div>
      ))}
    </div>
  );
}
```

### JavaScript Fetch

```javascript
const API = "https://market-api-n9paign16-suppchai0-projects.vercel.app/api/bookings";

// Get all bookings
fetch(API)
  .then(res => res.json())
  .then(data => console.log(data.data));

// Create booking
fetch(API, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    storeName: "ร้านใหม่",
    ownerName: "สมชาย",
    phone: "0812345678",
    email: "test@example.com",
    shopType: "food",
    stallNumber: "A01",
    bookingDate: "2025-01-15"
  })
})
.then(res => res.json())
.then(data => console.log(data.data));

// Update status
fetch(`${API}/:id`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'approved' })
})
.then(res => res.json())
.then(data => console.log(data.data));

// Delete
fetch(`${API}/:id`, { method: 'DELETE' })
.then(res => res.json())
.then(data => console.log(data));
```

---

## 🧪 การทดสอบ API

### ใช้ curl

```bash
# Get all
curl https://market-api-n9paign16-suppchai0-projects.vercel.app/api/bookings

# Create
curl -X POST https://market-api-n9paign16-suppchai0-projects.vercel.app/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"storeName":"ร้านใหม่","ownerName":"สมชาย","phone":"0812345678","email":"test@example.com","shopType":"food","stallNumber":"A01","bookingDate":"2025-01-15"}'
```

### ใช้ Postman
1. Import endpoints เพื่อใช้ใน Postman
2. Set Base URL: `https://market-api-n9paign16-suppchai0-projects.vercel.app/api`
3. Test แต่ละ endpoint

---

## 📁 Project Structure

```
market-api/
├── app/
│   ├── api/
│   │   └── bookings/
│   │       ├── route.js           # GET all, POST create
│   │       └── [id]/
│   │           └── route.js       # GET single, PUT, DELETE
│   ├── page.js                    # API Status page
│   ├── layout.js
│   └── globals.css
├── models/
│   └── Booking.js                 # Mongoose schema
├── lib/
│   └── mongodb.js                 # MongoDB connection
├── docker-compose.yml
├── Dockerfile
├── package.json
├── .env.local                     # Local env (not in git)
└── README.md
```

---

## 🌍 Environment Variables

### Local (.env.local)
```env
MONGODB_URI=mongodb+srv://suppachai4454_db_user:PASSWORD@cluster0.kcllz2s.mongodb.net/market-api?appName=Cluster0
```

### Vercel Dashboard
Set `MONGODB_URI` in Project Settings > Environment Variables

---

## 🐛 Troubleshooting

### API Connection Error
```
✓ ตรวจสอบ MongoDB Atlas cluster status
✓ ตรวจสอบ MONGODB_URI ถูกต้อง
✓ ตรวจสอบ IP whitelist ใน MongoDB Atlas
```

### Docker Error
```bash
# Restart containers
docker-compose down
docker-compose up -d

# View logs
docker-compose logs market-nextjs
docker-compose logs market-mongo
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# หรือเปลี่ยน port ใน docker-compose.yml
```

---

## 📚 เอกสารเพิ่มเติม

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Mongoose Documentation](https://mongoosejs.com)
- [Vercel Documentation](https://vercel.com/docs)

---

## 🤝 วิธี Contribute

1. Fork repository
2. สร้าง branch สำหรับ feature: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. สร้าง Pull Request

---

## 📄 License

MIT License

---

## 👨‍💻 Author

- GitHub: [@suppchai0](https://github.com/suppchai0)
- Repository: [market-api](https://github.com/suppchai0/market-api)
- Live API: [market-api.vercel.app](https://market-api-n9paign16-suppchai0-projects.vercel.app)

---

**ติดต่อสำหรับคำถาม**: สามารถสร้าง Issue ใน GitHub repository นี้ได้

## 🛠️ เทคโนโลยี

| เทคโนโลยี | เวอร์ชัน | วัตถุประสงค์ |
|----------|---------|-----------|
| Next.js | 16.1.1 | Framework หลัก |
| React | Latest | UI Components |
| Mongoose | 8.0.0 | ORM สำหรับ MongoDB |
| Tailwind CSS | Latest | Styling |
| Docker | Latest | Containerization |
| Node.js | 20-alpine | Runtime |

## 📦 ข้อกำหนดเบื้องต้น

- Docker Desktop และ Docker Compose
- Node.js 20+ (หากรัน local โดยไม่ใช้ Docker)
- npm หรือ yarn

## 🚀 วิธีการติดตั้งและรัน

### วิธี 1: ใช้ Docker Compose (แนะนำ)

```bash
# Clone repository
git clone https://github.com/suppchai0/market-api.git
cd market-api

# สร้างและรัน containers
docker-compose up -d

# ตรวจสอบ status
docker-compose ps
```

ระบบจะรันได้ที่:
- **Next.js Dashboard**: http://localhost:3000
- **MongoDB**: localhost:27017

### วิธี 2: รัน Local (โดยไม่ใช้ Docker)

```bash
# Clone repository
git clone https://github.com/suppchai0/market-api.git
cd market-api

# ติดตั้ง dependencies
npm install

# สร้าง .env.local
echo "MONGODB_URI=mongodb://root:example@localhost:27017/market-api?authSource=admin" > .env.local

# รัน MongoDB ก่อน (ต้องมี MongoDB installed)
mongod

# ในอีก terminal รัน Next.js
npm run dev
```

## 📊 Project Structure

```
market-api/
├── app/
│   ├── api/
│   │   └── bookings/
│   │       ├── route.js           # GET all, POST create
│   │       └── [id]/
│   │           └── route.js       # GET single, PUT update, DELETE
│   ├── components/
│   │   └── BookingTable.js        # Booking table component
│   ├── page.js                    # Admin dashboard
│   ├── layout.js                  # Root layout
│   └── globals.css                # Global styles
├── models/
│   └── Booking.js                 # Mongoose booking schema
├── lib/
│   └── mongodb.js                 # MongoDB connection
├── public/                        # Static files
├── docker-compose.yml             # Docker services configuration
├── Dockerfile                     # Next.js container image
├── package.json                   # Dependencies
├── .env.local                     # Environment variables
└── README.md                      # This file
```

## 📡 API Endpoints

### GET - ดึงข้อมูลการจองทั้งหมด

```bash
GET /api/bookings

Response:
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "storeName": "ร้านขนม",
      "ownerName": "นายสมชาย",
      "phone": "0812345678",
      "email": "somchai@example.com",
      "shopType": "food",
      "stallNumber": "A01",
      "bookingDate": "2025-01-10",
      "status": "pending",
      "createdAt": "2025-01-09T...",
      "updatedAt": "2025-01-09T..."
    }
  ]
}
```

### POST - สร้างการจองใหม่

```bash
POST /api/bookings

Body:
{
  "storeName": "ร้านขนม",
  "ownerName": "นายสมชาย",
  "phone": "0812345678",
  "email": "somchai@example.com",
  "shopType": "food",
  "stallNumber": "A01",
  "bookingDate": "2025-01-10"
}

Response:
{
  "success": true,
  "data": { ... }
  "status": 201
}
```

### GET - ดึงข้อมูลการจองเดียว

```bash
GET /api/bookings/:id

Response:
{
  "success": true,
  "data": { ... }
}
```

### PUT - อัพเดทสถานะการจอง

```bash
PUT /api/bookings/:id

Body:
{
  "status": "approved"  // or "rejected" or "pending"
}

Response:
{
  "success": true,
  "data": { ... }
}
```

### DELETE - ลบการจอง

```bash
DELETE /api/bookings/:id

Response:
{
  "success": true,
  "data": { deletedCount: 1 }
}
```

## 🔑 Environment Variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์ root:

```env
MONGODB_URI=mongodb://root:example@localhost:27017/market-api?authSource=admin
```

**สำหรับ Docker Compose**: ค่าตัวแปรถูกกำหนดอยู่แล้วใน `docker-compose.yml`

## 📝 Booking Schema

```javascript
{
  _id: ObjectId,              // Auto-generated
  storeName: String,          // ชื่อร้าน (บังคับ)
  ownerName: String,          // ชื่อเจ้าของ (บังคับ)
  phone: String,              // เบอร์โทร 10 หลัก (บังคับ)
  email: String,              // อีเมล (บังคับ, มี validation)
  shopType: String,           // ประเภท: food, clothing, goods, other (บังคับ)
  stallNumber: String,        // หมายเลขสถาน (บังคับ)
  bookingDate: Date,          // วันที่จอง (บังคับ)
  status: String,             // pending, approved, rejected (default: pending)
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

## 💻 Admin Dashboard Features

- ✅ ดูสถิติการจอง (Total, Pending, Approved, Rejected)
- ✅ ตารางแสดงข้อมูลการจองทั้งหมด
- ✅ ปุ่ม Approve - อนุมัติการจอง
- ✅ ปุ่ม Reject - ปฏิเสธการจอง
- ✅ ปุ่ม Delete - ลบการจอง
- ✅ Auto-refresh หลังจากแก้ไขข้อมูล
- ✅ Error handling และ loading states

## 🧪 การทดสอบ API

### ใช้ curl:

```bash
# ดึงข้อมูลทั้งหมด
curl http://localhost:3000/api/bookings

# สร้างการจองใหม่
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "ร้านกาแฟ",
    "ownerName": "นายกำธร",
    "phone": "0898765432",
    "email": "komtorn@example.com",
    "shopType": "food",
    "stallNumber": "B02",
    "bookingDate": "2025-01-15"
  }'

# อัพเดทสถานะ
curl -X PUT http://localhost:3000/api/bookings/:id \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'

# ลบการจอง
curl -X DELETE http://localhost:3000/api/bookings/:id
```

### ใช้ Postman:
1. Import endpoints จาก API_GUIDE.md
2. Set Authorization ถ้าจำเป็น
3. Test แต่ละ endpoint

## 🐛 Troubleshooting

### MongoDB connection error
```bash
# ตรวจสอบว่า container รันอยู่
docker-compose ps

# ดูลอก MongoDB
docker-compose logs market-mongo

# Restart containers
docker-compose restart
```

### Next.js not starting
```bash
# ดูลอก Next.js
docker-compose logs market-nextjs

# ลบ .next folder และ restart
docker-compose down
docker-compose up -d --build
```

### Port already in use
```bash
# เปลี่ยน port ใน docker-compose.yml
# หรือ kill process ที่ใช้ port
lsof -i :3000
kill -9 <PID>
```

## 📚 ไฟล์เพิ่มเติม

- [API_GUIDE.md](API_GUIDE.md) - เอกสาร API โดยละเอียด

## 🤝 Contributing

ถ้าต้องการมีส่วนร่วม:
1. Fork repository นี้
2. สร้าง branch สำหรับ feature ใหม่
3. Commit changes
4. Push ขึ้น GitHub
5. สร้าง Pull Request

## 📄 License

MIT License

## 👨‍💻 Author

- GitHub: [@suppchai0](https://github.com/suppchai0)

---

**ติดต่อสำหรับคำถาม**: สามารถสร้าง Issue ใน GitHub repository นี้ได้
