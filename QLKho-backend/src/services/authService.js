const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { TaiKhoan, NhanVien } = require('../models');
const SECRET_KEY = process.env.SECRET_KEY;
const sendEmail = require('../mailUtil');

const login = async (username, password) => {
  const user = await TaiKhoan.findByPk(username);
  if (!user) throw new Error('Tài khoản / mật khẩu không chính xác');
  if (username !== user.UserName) { throw new Error('Tài khoản / mật khẩu không chính xác'); }

  const isMatch = await bcrypt.compare(password, user.MatKhau);
  if (!isMatch) {
    throw new Error('Tài khoản / mật khẩu không chính xác');
  }
  
  if (user.TrangThai == 'inactive') throw new Error('Tài khoản / mật khẩu không chính xác');
  
  const token = jwt.sign(
    { userid: user.MaNV, username: user.UserName, role: user.PhanQuyen },
    SECRET_KEY,
    { expiresIn: '15m' }
  );

  const ten = await NhanVien.findOne({ where: { MaNV: user.MaNV } });

  return {
    token,
    user: {
      UserName: user.UserName,
      PhanQuyen: user.PhanQuyen,
      MaNV: user.MaNV,
      TenNV: ten.HoTenNV,
    }
  };
};

const forgotPassword = async (username, email, origin) => {
  const account = await TaiKhoan.findOne({
    where: { UserName: username },
    include: [
      {
        model: NhanVien,
        as: 'nhanVien',
        attributes: ['Email', 'HoTenNV']
      }
    ]
  });

  if (!account) throw new Error("Không tìm thấy tài khoản.");

  if (String(account.nhanVien.Email).trim().toLowerCase() !== String(email).trim().toLowerCase()) {
    throw new Error("Email không khớp với tài khoản.");
  }

  const token = jwt.sign({ user: account.UserName }, SECRET_KEY, { expiresIn: '5m' });

  const resetLink = `${origin}/reset-password?token=${token}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`;

  const html = `
    <p>Xin chào ${account.nhanVien.HoTenNV},</p>
    <p>Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
    <p>Nhấn vào nút bên dưới để đặt lại mật khẩu. Link sẽ hết hạn sau 5 phút.</p>
    <p><a href="${resetLink}" style="display:inline-block;padding:10px 16px;border-radius:6px;text-decoration:none;border:1px solid #1976d2;">Đặt lại mật khẩu</a></p>
    <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
  `;

  await sendEmail({ to: email, subject: 'Yêu cầu đặt lại mật khẩu', html });
};

const resetPassword = async (username, email, token, newPassword) => {
  let decoded;
  try {
    decoded = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw new Error('Token không hợp lệ hoặc đã hết hạn.');
  }

  if (decoded.user !== username) {
    throw new Error('Token không hợp lệ.');
  }

  const user = await TaiKhoan.findOne({
  where: { UserName: decoded.user },     
  include: [
    {
      model: NhanVien,
      as: "nhanVien",
      attributes: ["Email"]
    }
  ]
  });

  if (!user) throw new Error('Token không hợp lệ hoặc thông tin không khớp.');

  if (String(user.nhanVien.Email).trim().toLowerCase() !== String(email).trim().toLowerCase()) {
    throw new Error("Email không khớp với tài khoản.");
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await TaiKhoan.update({ MatKhau: hashed }, { where: {UserName: username} });

  // gửi email xác nhận
  const html = `<p>Mật khẩu của bạn đã được đổi thành công.</p>`;
  await sendEmail({ to: email, subject: 'Mật khẩu đã được thay đổi', html });
};


module.exports = { 
  login,
  forgotPassword,
  resetPassword
};