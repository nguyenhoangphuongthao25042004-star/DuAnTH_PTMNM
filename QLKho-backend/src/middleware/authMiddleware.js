const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Thiếu token xác thực' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    next();
  };
};

const validateLogin = (req, res, next) => {
  const data = req.body;

  // username
  if (!data.username || String(data.username).trim() === "") {
    return res.status(400).json({ message: "Tài khoản không được để trống" });
  }
  if (String(data.username).length > 10) {
    return res.status(400).json({ message: "Tài khoản / mật khẩu không chính xác" });
  }

  // password
  if (!data.password || String(data.password).trim() === "") {
    return res.status(400).json({ message: "Mật khẩu không được để trống" });
  }
  if (String(data.password).length > 30) {
    return res.status(400).json({ message: "Tài khoản / mật khẩu không chính xác" });
  }

  return next();
};

module.exports = { 
  authenticateToken, 
  authorizeRoles,
  validateLogin 
};