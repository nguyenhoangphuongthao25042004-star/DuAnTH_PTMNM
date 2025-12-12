const nhanVienService = require('../services/nhanvienService');

const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const {count, rows} = await nhanVienService.getAll(offset, limit);
    const totalPages = Math.ceil(count / limit);
    
    res.json({ 
      totalPages,
      page,
      data: rows });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách nhân viên', error: error.message });
  }
};

const getById = async (req, res) => {
  const { MaNV } = req.params;
  if (!MaNV) {
    return res.status(400).json({ message: "Thiếu MaNV trong params" });
  }

  try {
    const item = await nhanVienService.getById(MaNV);
    if (!item) return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    res.json(item);

  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy nhân viên", error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const newNhanVien = await nhanVienService.create(req.body);
    return res.status(201).json({ message: "Tạo nhân viên & tài khoản thành công", data: newNhanVien });

  } catch (error) {
    return res.status(400).json({ message: "Lỗi khi tạo nhân viên", error: error.message });
  }
};

const update = async (req, res) => {
  const { MaNV } = req.params;
  try {
    const updated = await nhanVienService.update(MaNV, req.body);
    res.status(200).json({ message: 'Cập nhật thành công', data: updated });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  const { MaNV } = req.params;
  try {
    await nhanVienService.remove(MaNV);
    res.status(200).json({ message: 'Vô hiệu hóa nhân viên và tài khoản thành công'});

  } catch (error) {
    res.status(400).json({ message: "Lỗi khi vô hiệu hóa nhân viên và tài khoản", error: error.message });
  }
};

const findByMaNVOrTen = async (req, res) => {
  const {keyword} = req.query;
  if (!keyword) {
    return res.status(400).json({ message: "Chưa nhập MaNV hoặc tên" });
  }
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
  
    const {count, rows} = await nhanVienService.findByMaNVOrTen(keyword, offset, limit);
    const totalPages = Math.ceil(count / limit);
    if (rows.length === 0 ) return res.status(404).json({ message: 'Không tìm thấy nhân viên nào' });

  
    res.json({ 
      totalPages,
      page,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách nhân viên', error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  findByMaNVOrTen
};