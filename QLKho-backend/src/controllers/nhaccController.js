const nhaccService = require('../services/nhaccService');

const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const {count, rows} = await nhaccService.getAll(offset, limit);
    const totalPages = Math.ceil(count / limit);
    
    res.json({ 
      totalPages,
      page,
      data: rows 
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách nhà cung cấp', error: error.message });
  }
};

const getById = async (req, res) => {
  const { MaNCC } = req.params;
  if (!MaNCC) {
    return res.status(400).json({ message: "Thiếu MaNCC trong params" });
  }

  try {
    const item = await nhaccService.getById(MaNCC);
    if (!item) return res.status(404).json({ message: "Không tìm thấy nhà cung cấp" });
    res.json(item);

  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy nhà cung cấp", error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const newNhaCungCap = await nhaccService.create(req.body);
    res.status(201).json({ message: 'Thêm nhà cung cấp thành công', data: newNhaCungCap });

  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi thêm nhà cung cấp', error: error.message });
  }
};

const update = async (req, res) => {
  const { MaNCC } = req.params;
  if (!MaNCC) {
    return res.status(400).json({ message: "Thiếu MaNCC trong params" });
  }

  try {
    const updated = await nhaccService.update(MaNCC, req.body);
    res.status(200).json({ message: 'Cập nhật thành công', data: updated });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const findByMaNCCOrTen = async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.status(400).json({ message: "Chưa nhập MaNCC hoặc tên" });
  }
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
  
    const {count, rows} = await nhaccService.findByMaNCCOrTen(keyword, offset, limit);
    const totalPages = Math.ceil(count / limit);
    if (rows.length === 0 ) return res.status(404).json({ message: 'Không tìm thấy nhà cung cấp nào' });
  
    res.json({ 
      totalPages,
      page,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách nhà cung cấp', error: error.message });
  }
};

const supplierHistory = async(req, res) => {
  const { MaNCC } = req.params;
  if (!MaNCC) {
    return res.status(400).json({ message: "Thiếu MaNCC trong params" });
  }

  try {
    const result = await nhaccService.supplierHistory(MaNCC);
    const totalPages = Number(result.count);

    res.json({ 
      totalPages,
      data: result.data
    });
  } catch(error) {
        res.status(500).json({ message: 'Lỗi khi lấy lịch sử cung cấp', error: error.message });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  findByMaNCCOrTen,
  supplierHistory
};