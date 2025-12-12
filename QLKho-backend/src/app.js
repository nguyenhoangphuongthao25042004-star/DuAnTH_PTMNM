require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const authRoutes = require('./routes/authRoute');
const vattuRoutes = require('./routes/vattuRoute');
const nhaccRoutes = require('./routes/nhaccRoute');
const nhanvienRoutes = require('./routes/nhanvienRoute');
const taikhoanRoutes = require('./routes/taikhoanRoute');

const app = express();
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vattu', vattuRoutes);
app.use('/api/nhacc', nhaccRoutes);
app.use('/api/nhanvien', nhanvienRoutes);
app.use('/api/taikhoan', taikhoanRoutes);

module.exports = app;
