const validateUpdateTK = (req, res, next) => {
  const data = req.body;
  const {UserName} = req.params;

  // Không cho sửa UserName
  if (data.UserName && data.UserName != UserName) {
    return res.status(400).json({ message: "Không được sửa username" });
  }

  // Không cho sửa MatKhau
  if (data.MatKhau !== undefined) {
    return res.status(400).json({ message: "Không được sửa mật khẩu" });
  }

  // PhanQuyen
  if (data.PhanQuyen !== undefined) {
    if (String(data.PhanQuyen).trim() === "") {
      return res.status(400).json({ message: "Phân quyền không được để trống" });
    }
    if (String(data.PhanQuyen).length > 30) {
      return res.status(400).json({ message: "Phân quyền tối đa 30 ký tự" });
    }
  }

  // Không cho sửa TrangThai
  if (data.TrangThai !== undefined) {
    return res.status(400).json({ message: "Không được sửa trạng thái" });
  }

  // Không cho sửa MaNV
  if (data.MaNV !== undefined) {
    return res.status(400).json({ message: "Không được sửa mã nhân viên" });
  }

  return next();
};

const validateChangePassword = async (req, res, next) => {
  const data = req.body;

  // oldPassword
  if(data.oldPassword !== undefined) {
    if (String(data.oldPassword).trim() === "") {
      return res.status(400).json({ message: "Mật khẩu cũ không được để trống" });
    }
    if (String(data.oldPassword).length > 30) {
      return res.status(400).json({ message: "Mật khẩu cũ tối đa 30 ký tự" });
    }
  }

  // newPassword
  if(data.newPassword !== undefined) {
    if (String(data.newPassword).trim() === "") {
      return res.status(400).json({ message: "Mật khẩu mới không được để trống" });
    }
    if (String(data.newPassword).length > 30) {
      return res.status(400).json({ message: "Mật khẩu mới tối đa 30 ký tự" });
    }
  }

  // confirmPassword
  if(data.confirmNewPassword !== undefined) {
    if (String(data.confirmNewPassword).trim() === "") {
      return res.status(400).json({ message: "Xác nhận mật khẩu mới không được để trống" });
    }
    if (String(data.confirmNewPassword).length > 30) {
      return res.status(400).json({ message: "Xác nhận mật khẩu mới tối đa 30 ký tự" });
    }
  }

  return next();
};

const validateSearchTK = (req, res, next) => {
  const { keyword } = req.query;
  if (String(keyword).length > 20) {
    return res.status(400).json({ message: "Không tìm thấy" });
  }
  return next();
}

module.exports = {
  validateUpdateTK,
  validateChangePassword,
  validateSearchTK
};
