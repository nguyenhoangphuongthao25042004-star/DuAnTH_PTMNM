const MANCC_REGEX = /^NCC[0-9]{1,7}$/i;
const SDT_REGEX = /^[0-9]{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateCreateNCC = (req, res, next) => {
  const data = req.body;

  // MaNCC
  if (!data.MaNCC || String(data.MaNCC).trim() === "") {
    return res.status(400).json({ message: "Mã nhà cung cấp không được để trống" });
  }
  if (!MANCC_REGEX.test(String(data.MaNCC))) {
    return res.status(400).json({ message: "Mã nhà cung cấp phải bắt đầu bằng 'NCC' và tối đa 7 số phía sau" });
  }
  if (String(data.MaNCC).length > 10) {
    return res.status(400).json({ message: "Mã nhà cung cấp tối đa 10 ký tự" });
  }

  // TenNCC
  if (!data.TenNCC || String(data.TenNCC).trim() === "") {
    return res.status(400).json({ message: "Tên nhà cung cấp không được để trống" });
  }
  if (String(data.TenNCC).length > 50) {
    return res.status(400).json({ message: "Tên nhà cung cấp tối đa 50 ký tự" });
  }

  // DiaChi
  if (!data.DiaChi || String(data.DiaChi).trim() === "") {
    return res.status(400).json({ message: "Địa chỉ không được để trống" });
  }
  if (String(data.DiaChi).length > 50) {
    return res.status(400).json({ message: "Địa chỉ tối đa 50 ký tự" });
  }

  // SDT
  if (!data.SDT || String(data.SDT).trim() === "") {
    return res.status(400).json({ message: "Số điện thoại không được để trống" });
  }
  if (!SDT_REGEX.test(String(data.SDT))) {
    return res.status(400).json({ message: "Số điện thoại phải đúng 10 số" });
  }

  // Email
  if (!data.Email || String(data.Email).trim() === "") {
    return res.status(400).json({ message: "Email không được để trống" });
  }
  if (!EMAIL_REGEX.test(String(data.Email))) {
    return res.status(400).json({ message: "Email không hợp lệ" });
  }
  if (String(data.Email).length > 30) {
    return res.status(400).json({ message: "Email tối đa 30 ký tự" });
  }

  // Người đại diện
  if (!data.NguoiDaiDien || String(data.NguoiDaiDien).trim() === "") {
    return res.status(400).json({ message: "Người đại diện không được để trống" });
  }
  if (String(data.NguoiDaiDien).length > 50) {
    return res.status(400).json({ message: "Người đại diện tối đa 50 ký tự" });
  }

  return next();
};

const validateUpdateNCC = (req, res, next) => {
  const data = req.body;
  const {MaNCC} = req.params;

  // Không cho sửa MaNCC
  if (data.MaNCC && data.MaNCC != MaNCC) {
    return res.status(400).json({ message: "Không được thay đổi mã nhà cung cấp" });
  }

  // Tên nhà cung cấp
  if (data.TenNCC !== undefined) {
    if (String(data.TenNCC).trim() === "") {
      return res.status(400).json({ message: "Tên nhà cung cấp không được để trống" });
    }
    if (String(data.TenNCC).length > 50) {
      return res.status(400).json({ message: "Tên nhà cung cấp tối đa 50 ký tự" });
    }
  }

  // Địa chỉ
  if (data.DiaChi !== undefined) {
    if (String(data.DiaChi).trim() === "") {
      return res.status(400).json({ message: "Địa chỉ nhà cung cấp không được để trống" });
    }
    if (String(data.DiaChi).length > 50) {
      return res.status(400).json({ message: "Địa chỉ nhà cung cấp tối đa 50 ký tự" });
    }
  }

  // Số điện thoại
  if (data.SDT !== undefined) {
    if (String(data.SDT).trim() === "") {
      return res.status(400).json({ message: "Số điện thoại không được để trống" });
    }
    if (!SDT_REGEX.test(String(data.SDT))) {
      return res.status(400).json({ message: "Số điện thoại phải đúng 10 số" });
    }
  }

  // Email
  if (data.Email !== undefined) {
    if (String(data.DiaChi).trim() === "") {
      return res.status(400).json({ message: "Email không được để trống" });
    }
    if (!EMAIL_REGEX.test(String(data.Email))) {
      return res.status(400).json({ message: "Email không hợp lệ" });
    }
    if (String(data.Email).length > 30) {
      return res.status(400).json({ message: "Email tối đa 30 ký tự" });
    }
  }

  // Người đại diện
  if (data.NguoiDaiDien !== undefined) {
    if (String(data.NguoiDaiDien).trim() === "") {
      return res.status(400).json({ message: "Người đại diện không được để trống" });
    }
    if (String(data.NguoiDaiDien).length > 50) {
      return res.status(400).json({ message: "Tên người đại diện tối đa 50 ký tự" });
    }
  }

  return next();
};

const validateSearchNCC = (req, res, next) => {
  const { keyword } = req.query;
  if (String(keyword).length > 20) {
    return res.status(400).json({ message: "Không tìm thấy" });
  }
  return next();
}

module.exports = {
    validateCreateNCC,
    validateUpdateNCC,
    validateSearchNCC
};
