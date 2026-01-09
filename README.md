# Market API - Market Stall Booking System

ระบบจัดการการจองสถานที่ตั้งร้านค้าในตลาด โดยใช้ Next.js, MongoDB และ Docker

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Latest-blue?logo=docker)

## 📋 คำบรรยาย

Market API เป็นเว็บแอปพลิเคชันสำหรับจัดการการจองสถานที่ตั้งร้านค้าในตลาด ประกอบด้วย:
- 🔧 **Backend API** - RESTful API สำหรับจัดการข้อมูลการจอง
- 💼 **Admin Dashboard** - หน้าแสดงข้อมูลการจองทั้งหมด พร้อมคุณสมบัติในการอนุมัติ ปฏิเสธ และลบการจอง
- 🗄️ **MongoDB Database** - จัดเก็บข้อมูลการจองและสถานที่ต่างๆ
- 🐳 **Docker Compose** - สำหรับ containerization และการจัดการ services

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
