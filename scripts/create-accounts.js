/**
 * Script to Create Admin and User Accounts
 * Run in browser console or Node.js environment
 * 
 * API Base URL:
 * - Local: http://localhost:3000/api
 * - Production: https://market-api-mu.vercel.app/api
 */

const API_BASE = "http://localhost:3000/api"; // Change to production URL if needed

/**
 * ==========================================
 * ADMIN ACCOUNT CREATION
 * ==========================================
 */

// Admin credentials (default)
const ADMIN_CREDS = {
  email: "admin@sisaket.go.th",
  password: "admin123"
};

async function createAdmin() {
  console.log("🔑 Creating Admin Account...");
  console.log("Email:", ADMIN_CREDS.email);
  
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "admin_sisaket",
      email: ADMIN_CREDS.email,
      password: ADMIN_CREDS.password,
      fullName: "Admin Sisaket Market"
    })
  });

  const data = await response.json();
  
  if (data.success) {
    console.log("✅ Admin created successfully!");
    console.log("Token:", data.data.token);
    localStorage.setItem("adminToken", data.data.token);
    return data.data;
  } else {
    console.error("❌ Error:", data.error);
    return null;
  }
}

/**
 * ==========================================
 * USER ACCOUNT CREATION (Sample Users)
 * ==========================================
 */

const SAMPLE_USERS = [
  {
    username: "merchant_01",
    email: "merchant1@market.com",
    password: "Merchant@123",
    fullName: "ค้นการนำสินค้า 1"
  },
  {
    username: "merchant_02",
    email: "merchant2@market.com",
    password: "Merchant@123",
    fullName: "ค้นการนำสินค้า 2"
  },
  {
    username: "vendor_coffee",
    email: "coffee@market.com",
    password: "Coffee@2026",
    fullName: "ร้านกาแฟเดือน"
  },
  {
    username: "vendor_food",
    email: "food@market.com",
    password: "Food@2026",
    fullName: "ร้านอาหารสดใหม่"
  },
  {
    username: "seller_cloth",
    email: "cloth@market.com",
    password: "Cloth@2026",
    fullName: "ร้านเสื้อผ้า"
  }
];

async function createUser(userInfo) {
  console.log(`👤 Creating User: ${userInfo.fullName}...`);
  
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInfo)
  });

  const data = await response.json();
  
  if (data.success) {
    console.log(`✅ User '${userInfo.fullName}' created successfully!`);
    console.log(`   Email: ${userInfo.email}`);
    console.log(`   Password: ${userInfo.password}`);
    console.log(`   Token: ${data.data.token.substring(0, 20)}...`);
    return data.data;
  } else {
    console.error(`❌ Error creating '${userInfo.fullName}':`, data.error);
    return null;
  }
}

async function createAllUsers() {
  console.log("👥 Creating Sample Users...\n");
  const users = [];
  
  for (const userInfo of SAMPLE_USERS) {
    const user = await createUser(userInfo);
    if (user) users.push(user);
    await new Promise(resolve => setTimeout(resolve, 500)); // Delay between requests
  }
  
  console.log(`\n✅ Created ${users.length} users total!\n`);
  return users;
}

/**
 * ==========================================
 * ADMIN LOGIN
 * ==========================================
 */

async function adminLogin() {
  console.log("🔓 Admin Login...");
  
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: ADMIN_CREDS.email,
      password: ADMIN_CREDS.password
    })
  });

  const data = await response.json();
  
  if (data.success) {
    console.log("✅ Admin login successful!");
    console.log("Token:", data.data.token);
    localStorage.setItem("adminToken", data.data.token);
    return data.data.token;
  } else {
    console.error("❌ Login failed:", data.error);
    return null;
  }
}

/**
 * ==========================================
 * USER LOGIN
 * ==========================================
 */

async function userLogin(email, password) {
  console.log(`🔓 User Login: ${email}...`);
  
  const response = await fetch(`${API_BASE}/auth/user-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  
  if (data.success) {
    console.log("✅ User login successful!");
    console.log("Token:", data.data.token);
    localStorage.setItem("userToken", data.data.token);
    return data.data.token;
  } else {
    console.error("❌ Login failed:", data.error);
    return null;
  }
}

/**
 * ==========================================
 * USAGE EXAMPLES
 * ==========================================
 */

/*
// Run in browser console:

// 1. Create Admin
await createAdmin();

// 2. Login as Admin
await adminLogin();

// 3. Create All Sample Users
await createAllUsers();

// 4. Login as Specific User
await userLogin("merchant1@market.com", "Merchant@123");

// 5. Get All Bookings (as Admin)
const token = localStorage.getItem("adminToken");
fetch("http://localhost:3000/api/bookings", {
  headers: { "Authorization": `Bearer ${token}` }
})
  .then(r => r.json())
  .then(d => console.log(d));
*/

/**
 * ==========================================
 * EXPORT FOR NODE.JS / TESTING
 * ==========================================
 */

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createAdmin,
    createUser,
    createAllUsers,
    adminLogin,
    userLogin,
    ADMIN_CREDS,
    SAMPLE_USERS,
    API_BASE
  };
}
