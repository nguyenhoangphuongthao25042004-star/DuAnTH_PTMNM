const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SDT_REGEX = /^[0-9]{10}$/;
const CCCD_REGEX = /^[0-9]{9,12}$/;
const MANV_REGEX = /^NV[0-9]{1,8}$/i;
const MIN_AGE = 16;
const MAX_AGE = 100;

function tinhTuoi(ngaysinh) {
  const d = new Date(ngaysinh);
  if (isNaN(d.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) 
    age--;
  return age;
}

const validateCreateNV = (req, res, next) => {
  const data = req.body;

  // MaNV
  if (!data.MaNV || String(data.MaNV).trim() === "") {
    return res.status(400).json({ message: "Mã nhân viên không được để trống" });
  }
  if (!MANV_REGEX.test(String(data.MaNV))) {
    return res.status(400).json({ message: "Mã nhân viên phải bắt đầu bằng 'NV' và tối đa 8 số phía sau" });
  }
  if (String(data.MaNV).length > 10) {
    return res.status(400).json({ message: "Mã nhân viên tối đa 10 ký tự" });
  }

  // HoTenNV
  if (!data.HoTenNV || String(data.HoTenNV).trim() === "") {
    return res.status(400).json({ message: "Họ tên nhân viên không được để trống" });
  }
  if (String(data.HoTenNV).length > 50) {
    return res.status(400).json({ message: "Họ tên tối đa 50 ký tự" });
  }

  // ChucVu
  if (!data.ChucVu || String(data.ChucVu).trim() === "") {
    return res.status(400).json({ message: "Chức vụ không được để trống" });
  }
  if (String(data.ChucVu).length > 50) {
    return res.status(400).json({ message: "Chức vụ tối đa 50 ký tự" });
  }

  // GioiTinh
  if (!data.GioiTinh || String(data.GioiTinh).trim() === "") {
    return res.status(400).json({ message: "Giới tính không được để trống" });
  }
  if (String(data.GioiTinh).length > 5) {
    return res.status(400).json({ message: "Giới tính tối đa 5 ký tự" });
  }

  // NgaySinh
  if (!data.NgaySinh) {
    return res.status(400).json({ message: "Ngày sinh không được để trống" });
  }
  const age = tinhTuoi(data.NgaySinh);
  if (age === null) {
    return res.status(400).json({ message: "Ngày sinh không hợp lệ" });
  }
  if (age < MIN_AGE) {
    return res.status(400).json({ message: `Nhân viên phải >= ${MIN_AGE} tuổi` });
  }
  if (age > MAX_AGE) {
    return res.status(400).json({ message: `Tuổi không hợp lệ (> ${MAX_AGE})` });
  }

  // QueQuan
  if (!data.QueQuan || String(data.QueQuan).trim() === "") {
    return res.status(400).json({ message: "Quê quán không được để trống" });
  }
  if (String(data.QueQuan).length > 50) {
    return res.status(400).json({ message: "Quê quán tối đa 50 ký tự" });
  }

  // CCCD
  if (!data.CCCD || String(data.CCCD).trim() === "") {
    return res.status(400).json({ message: "CCCD không được để trống" });
  }
  if (!CCCD_REGEX.test(String(data.CCCD))) {
    return res.status(400).json({ message: "CCCD phải là 9–12 chữ số" });
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
    return res.status(400).json({ message: "Số điện thoại phải gồm 10 chữ số" });
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

  // TrangThai
  if (data.TrangThai !== undefined) {
    return res.status(400).json({ message: "Không được nhập trạng thái" });
  }

  return next();
};

const validateUpdateNV = (req, res, next) => {
  const data = req.body;
  const {MaNV} = req.params

  // Không cho sửa MaNV
  if (data.MaNV && data.MaNV != MaNV) {
    return res.status(400).json({ message: "Không được thay đổi mã nhân viên" });
  }

  // HoTenNV
  if (data.HoTenNV !== undefined) {
    if (String(data.HoTenNV).trim() === "") {
      return res.status(400).json({ message: "Họ tên nhân viên không được để trống" });
    }
    if (String(data.HoTenNV).length > 50) {
      return res.status(400).json({ message: "Họ tên tối đa 50 ký tự" });
    }
  }

  // ChucVu
  if (data.ChucVu !== undefined) {
    if (String(data.ChucVu).trim() === "") {
      return res.status(400).json({ message: "Chức vụ không được để trống" });
    }
    if (String(data.ChucVu).length > 50) {
      return res.status(400).json({ message: "Chức vụ tối đa 50 ký tự" });
    }
  }

  // GioiTinh
  if (data.GioiTinh !== undefined) {
    if (String(data.GioiTinh).trim() === "") {
      return res.status(400).json({ message: "Giới tính không được để trống" });
    }
    if (String(data.GioiTinh).length > 5) {
      return res.status(400).json({ message: "Giới tính tối đa 5 ký tự" });
    }
  }

  // NgaySinh
  if (data.NgaySinh !== undefined) {
    if (String(data.NgaySinh).trim() === "") {
      return res.status(400).json({ message: "Ngày sinh không được để trống" });
    }
    const age = tinhTuoi(data.NgaySinh);
    if (age === null) return res.status(400).json({ message: "Ngày sinh không hợp lệ" });
    if (age < MIN_AGE) return res.status(400).json({ message: `Nhân viên phải >= ${MIN_AGE} tuổi` });
    if (age > MAX_AGE) return res.status(400).json({ message: `Tuổi không hợp lệ (> ${MAX_AGE})` });
  }

  // QueQuan
  if (data.QueQuan !== undefined) {
    if (String(data.QueQuan).trim() === "") {
      return res.status(400).json({ message: "Quê quán không được để trống" });
    }
    if (String(data.QueQuan).length > 50) {
      return res.status(400).json({ message: "Quê quán tối đa 50 ký tự" });
    }
  }

  // CCCD
  if (data.CCCD !== undefined) {
    if (String(data.CCCD).trim() === "") {
      return res.status(400).json({ message: "CCCD không được để trống" });
    }
    if (!CCCD_REGEX.test(String(data.CCCD))) {
      return res.status(400).json({ message: "CCCD phải là 9–12 chữ số" });
    }
  }

  // DiaChi
  if (data.DiaChi !== undefined) {
    if (String(data.DiaChi).trim() === "") {
      return res.status(400).json({ message: "Địa chỉ không được để trống" });
    }
    if (String(data.DiaChi).length > 50) {
      return res.status(400).json({ message: "Địa chỉ tối đa 50 ký tự" });
    }
  }

  // SDT
  if (data.SDT !== undefined) {
    if (String(data.SDT).trim() === "") {
      return res.status(400).json({ message: "Số điện thoại không được để trống" });
    }
    if (!SDT_REGEX.test(String(data.SDT))) {
      return res.status(400).json({ message: "Số điện thoại phải gồm 10 chữ số" });
    }
  }

  // Email
  if (data.Email !== undefined) {
    if (String(data.Email).trim() === "") {
      return res.status(400).json({ message: "Email không được để trống" });
    }
    if (!EMAIL_REGEX.test(String(data.Email))) {
      return res.status(400).json({ message: "Email không hợp lệ" });
    }
    if (String(data.Email).length > 30) {
      return res.status(400).json({ message: "Email tối đa 30 ký tự" });
    }
  }

  // Không cho sửa TrangThai
  if (data.TrangThai !== undefined) {
    return res.status(400).json({ message: "Không được sửa trạng thái" });
  }

  return next();
};

const validateSearchNV = (req, res, next) => {
  const { keyword } = req.query;
  if (String(keyword).length > 20) {
    return res.status(400).json({ message: "Không tìm thấy" });
  }
  return next();
}

module.exports = {
    validateCreateNV,
    validateUpdateNV,
    validateSearchNV
};