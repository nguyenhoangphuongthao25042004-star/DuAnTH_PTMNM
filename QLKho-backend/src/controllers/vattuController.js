const vatTuService = require('../services/vattuService');

const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const {count, rows} = await vatTuService.getAll(offset, limit);
    const totalPages = Math.ceil(count / limit);
    res.json({ 
      totalPages,
      page,
      data: rows 
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách vật tư', error: error.message });
  }
};

const getById = async (req, res) => {
  const { MaVT } = req.params;
  if (!MaVT) {
    return res.status(400).json({ message: "Thiếu MaVT trong params" });
  }
  try {
    const item = await vatTuService.getById(MaVT);
    if (!item) return res.status(404).json({ message: "Không tìm thấy vật tư" });
    res.json(item);
    
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy vật tư", error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const newVatTu = await vatTuService.create(req.body);
    res.status(201).json({ message: 'Thêm vật tư thành công', data: newVatTu });
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi thêm vật tư', error: error.message });
  }
};

const update = async (req, res) => {
  const { MaVT } = req.params;
  try {
    const updated = await vatTuService.update(MaVT, req.body);
    res.status(200).json({ message: 'Cập nhật thành công', data: updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  const { MaVT } = req.params;
  try {
    await vatTuService.remove(MaVT);
    res.status(200).json({ message: 'Xóa vật tư thành công'});
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi xóa vật tư", error: error.message });
  }
};

const findByMaVTOrTen = async (req, res) => {
  const {keyword} = req.query;
  if (!keyword) {
    return res.status(400).json({ message: "Chưa nhập MaVT hoặc tên" });
  }
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const {count, rows} = await vatTuService.findByMaVTOrTen(keyword, offset, limit);
    const totalPages = Math.ceil(count / limit);
    if (rows.length === 0 ) return res.status(404).json({ message: 'Không tìm thấy vật tư nào' });

    res.json({ 
      totalPages,
      page,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách vật tư', error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  findByMaVTOrTen,
};