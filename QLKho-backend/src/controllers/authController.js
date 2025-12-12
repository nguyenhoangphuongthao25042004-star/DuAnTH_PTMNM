const authService = require('../services/authService');

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await authService.login(username, password);
    return res.status(200).json({ token: result.token, message: 'Đăng nhập thành công', user: result.user });
    
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { username, email, origin } = req.body;
  if (!username || !email) {
    return res.status(400).json({ message: 'Thiếu username hoặc email.' });
  }
  try {
    await authService.forgotPassword(username, email, origin);
    return res.json({ message:'Hệ thống đang kiểm tra nếu thông tin hợp lệ sẽ có 1 email reset mật khẩu được gửi vào mail của bạn.' });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { username, email, token, password } = req.body;

  if (!username || !email || !token || !password) {
    return res.status(400).json({ message: 'Thiếu thông tin (username, email, token, password).' });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Mật khẩu phải ít nhất 6 ký tự.' });
  }

  try {
    await authService.resetPassword(username, email, token, password);
    return res.json({ message: 'Đặt lại mật khẩu thành công.' });
    
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { 
  login,
  forgotPassword,
  resetPassword
};