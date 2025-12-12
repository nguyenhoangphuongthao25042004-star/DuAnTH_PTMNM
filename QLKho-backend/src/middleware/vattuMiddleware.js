const DONGIA_REGEX = /^\d+(\.\d{1,2})?$/;
const MAVT_REGEX = /^VT[0-9]{1,8}$/i;

const validateCreateVT = (req, res, next) => {
  const data = req.body;

  // MaVT
  if (!data.MaVT || String(data.MaVT).trim() === "") {
    return res.status(400).json({ message: "Mã vật tư không được để trống" });
  }
  if (!MAVT_REGEX.test(String(data.MaVT))) {
    return res.status(400).json({ message: "Mã vật tư phải bắt đầu bằng 'VT' và tối đa 8 kí tự phía sau" });
  }
  if (String(data.MaVT).length > 10) {
    return res.status(400).json({ message: "Mã vật tư tối đa 10 ký tự" });
  }

  // TenVT
  if (!data.TenVT || String(data.TenVT).trim() === "") {
    return res.status(400).json({ message: "Tên vật tư không được để trống" });
  }
  if (String(data.TenVT).length > 30) {
    return res.status(400).json({ message: "Tên vật tư tối đa 30 ký tự" });
  }

  // DonViTinh
  if (!data.DonViTinh || String(data.DonViTinh).trim() === "") {
    return res.status(400).json({ message: "Đơn vị tính không được để trống" });
  }
  if (String(data.DonViTinh).length > 10) {
    return res.status(400).json({ message: "Đơn vị tính tối đa 10 ký tự" });
  }

  // SoLuong
  if (data.SoLuong !== undefined) {
    return res.status(400).json({ message: "Không được nhập số lượng" });
  }

  // TrangThai
  if (data.TrangThai !== undefined) {
    return res.status(400).json({ message: "Không được nhập trạng thái" });
  }

  // DonGiaNhap
  if (!data.DonGiaNhap || String(data.DonGiaNhap).trim() === "") {
    return res.status(400).json({ message: "Đơn giá nhập không được để trống" });
  }
  if (!DONGIA_REGEX.test(String(data.DonGiaNhap))) {
    return res.status(400).json({ message: "Đơn giá nhập không hợp lệ" });
  }
  if (Number(data.DonGiaNhap) < 0) {
    return res.status(400).json({ message: "Đơn giá nhập phải >= 0" });
  }

  // DonGiaXuat
  if (!data.DonGiaXuat || String(data.DonGiaXuat).trim() === "") {
    return res.status(400).json({ message: "Đơn giá xuất không được để trống" });
  }
  if (!DONGIA_REGEX.test(String(data.DonGiaXuat))) {
    return res.status(400).json({ message: "Đơn giá xuất không hợp lệ" });
  }
  if (Number(data.DonGiaXuat) < 0) {
    return res.status(400).json({ message: "Đơn giá xuất phải >= 0" });
  }

  // MaLoai
  if (!data.MaLoai || String(data.MaLoai).trim() === "") {
    return res.status(400).json({ message: "Mã loại không được để trống" });
  }
  if (data.MaLoai.length > 10) {
    return res.status(400).json({ message: "Mã loại tối đa 10 ký tự" });
  }

  // MaChoChua
  if (!data.MaChoChua || String(data.MaChoChua).trim() === "") {
    return res.status(400).json({ message: "Mã chỗ chứa không được để trống" });
  }
  if (String(data.MaChoChua).length > 10) {
    return res.status(400).json({ message: "Mã chỗ chứa tối đa 10 ký tự" });
  }

  return next();
};

const validateUpdateVT = (req, res, next) => {
  const data = req.body;
  const {MaVT} = req.params;

  // Không cho sửa MaVT
  if (data.MaVT && data.MaVT != MaVT) {
    return res.status(400).json({ message: "Không được thay đổi mã vật tư" });
  }

  // TenVT
  if (data.TenVT !== undefined) {
    if (String(data.TenVT).trim() === "") {
      return res.status(400).json({ message: "Tên vật tư không được để trống" });
    }
    if (String(data.TenVT).length > 30) {
      return res.status(400).json({ message: "Tên vật tư tối đa 30 ký tự" });
    }
  }

  // DonViTinh
  if (data.DonViTinh !== undefined) {
    if (String(data.DonViTinh).trim() === "") {
      return res.status(400).json({ message: "Đơn vị tính không được để trống" });
    }
    if (String(data.DonViTinh).length > 10) {
      return res.status(400).json({ message: "Đơn vị tính tối đa 10 ký tự" });
    }
  }

  // SoLuong
  if (data.SoLuong !== undefined) {
    return res.status(400).json({ message: "Không được sửa số lượng" });
  }

  // TrangThai
  if (data.TrangThai !== undefined) {
    return res.status(400).json({ message: "Không được sửa trạng thái" });
  }

  // DonGiaNhap
  if (data.DonGiaNhap !== undefined) {
    if (String(data.DonGiaNhap).trim() === "") {
      return res.status(400).json({ message: "Đơn giá nhập không được để trống" });
    }
    if (!DONGIA_REGEX.test(String(data.DonGiaNhap))) {
      return res.status(400).json({ message: "Đơn giá nhập không hợp lệ" });
    }
    if (Number(data.DonGiaNhap) < 0) {
      return res.status(400).json({ message: "Đơn giá nhập phải >= 0" });
    }
  }

  //DonGiaXuat
  if (data.DonGiaXuat !== undefined) {
    if (String(data.DonGiaXuat).trim() === "") {
      return res.status(400).json({ message: "Đơn giá nhập không được để trống" });
    }
    if (!DONGIA_REGEX.test(String(data.DonGiaXuat))) {
      return res.status(400).json({ message: "Đơn giá xuất không hợp lệ" });
    }
    if (Number(data.DonGiaXuat) < 0) {
      return res.status(400).json({ message: "Đơn giá xuất phải >= 0" });
    }
  }

  // MaLoai
  if (data.MaLoai !== undefined && String(data.MaLoai).trim() === "") {
    return res.status(400).json({ message: "Mã loại không được để trống" });
  }

  // MaChoChua
  if (data.MaChoChua !== undefined && String(data.MaChoChua).trim() === "") {
    return res.status(400).json({ message: "Mã chỗ chứa không được để trống" });
  }

  return next();
};

const validateSearchVT = (req, res, next) => {
  const { keyword } = req.query;
  if (String(keyword).length > 20) {
    return res.status(400).json({ message: "Không tìm thấy" });
  }
  return next();
}

module.exports = {
    validateCreateVT,
    validateUpdateVT,
    validateSearchVT
};