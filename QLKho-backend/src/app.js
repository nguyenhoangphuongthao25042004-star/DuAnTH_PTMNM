require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
/* const authRoutes = require('./routes/authRoute');
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
app.use('/api/taikhoan', taikhoanRoutes); */

//module.exports = app;
// trigger backend deploy


app.get("/api/test-ci", (req, res) => {
  res.json({
    message: "CI/CD Backend OK 🎉",
    time: new Date().toLocaleString(),
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

