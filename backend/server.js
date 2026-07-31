import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database Store initialized with initial agency data
const db = {
  agency: {
    agencyName: "YTMR Indane Gas Agency",
    distributorCode: "IND-104829",
    oilCompany: "Indane Gas",
    phone: "+91 98765 43210",
    refillPrice14kg: 853.50,
    refillPrice19kg: 1785.00,
    subsidyAmount: 200.00,
  },
  customers: [
    {
      id: "cust-1",
      consumerNo: "IND-804912",
      svNumber: "SV-2021-9941",
      name: "Rajesh Kumar Sharma",
      phone: "9812345670",
      address: "H.No. 124, Block C, Green Valley Colony",
      area: "Green Valley",
      scheme: "general",
      cylinderType: "14.2kg",
      totalBookings: 14,
      lastRefillDate: "2026-07-10",
    },
    {
      id: "cust-2",
      consumerNo: "IND-804913",
      svNumber: "SV-PMUY-4012",
      name: "Sunita Devi",
      phone: "9876512340",
      address: "Qtr 18, PMUY Enclave, Rampur Village",
      area: "Rampur Village",
      scheme: "ujjwala",
      cylinderType: "14.2kg",
      totalBookings: 9,
      lastRefillDate: "2026-07-26",
    }
  ],
  bookings: [
    {
      id: "book-101",
      bookingNo: "LPG-2026-9041",
      consumerNo: "IND-804912",
      customerName: "Rajesh Kumar Sharma",
      scheme: "general",
      amount: 853.50,
      status: "delivered",
      bookingDate: "2026-07-25"
    }
  ]
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'LPG Management System REST API', timestamp: new Date() });
});

// AUTH ROUTE
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  res.json({
    token: "mock-jwt-token-lpg-agency",
    user: {
      id: "emp-1",
      name: email.split('@')[0],
      email: email,
      role: role || 'admin'
    }
  });
});

// CUSTOMERS API (CRUD)
app.get('/api/customers', (req, res) => {
  res.json(db.customers);
});

app.post('/api/customers', (req, res) => {
  const newCustomer = {
    id: `cust-${Date.now()}`,
    ...req.body,
    totalBookings: 0,
    createdAt: new Date().toISOString().split('T')[0]
  };
  db.customers.unshift(newCustomer);
  res.status(201).json(newCustomer);
});

app.put('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  const index = db.customers.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: "Customer not found" });
  db.customers[index] = { ...db.customers[index], ...req.body };
  res.json(db.customers[index]);
});

app.delete('/api/customers/:id', (req, res) => {
  db.customers = db.customers.filter(c => c.id !== req.params.id);
  res.json({ message: "Customer deleted successfully" });
});

// BOOKINGS API
app.get('/api/bookings', (req, res) => {
  res.json(db.bookings);
});

app.post('/api/bookings', (req, res) => {
  const newBooking = {
    id: `book-${Date.now()}`,
    bookingNo: `LPG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    bookingDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    ...req.body
  };
  db.bookings.unshift(newBooking);
  res.status(201).json(newBooking);
});

// REPORTS API
app.get('/api/reports/summary', (req, res) => {
  res.json({
    totalCustomers: db.customers.length,
    totalUjjwala: db.customers.filter(c => c.scheme === 'ujjwala').length,
    totalGeneral: db.customers.filter(c => c.scheme === 'general').length,
    totalBookings: db.bookings.length,
    agencyInfo: db.agency
  });
});

app.listen(PORT, () => {
  console.log(`🔥 LPG Management Server running on port ${PORT}`);
});

export default app;
