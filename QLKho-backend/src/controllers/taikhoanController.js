const taiKhoanService = require("../services/taikhoanService");

const getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await taiKhoanService.getAll(offset, limit);
    const totalPages = Math.ceil(count / limit);

    res.json({
      totalPages,
      page,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách tài khoản", error: error.message });
  }
};

const getById = async (req, res) => {
  const { UserName } = req.params;
  if (!UserName) {
    return res.status(400).json({ message: "Thiếu UserName trong params" });
  }

  try {
    const item = await taiKhoanService.getById(UserName);
    if (!item) return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    res.json(item);

  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy tài khoản", error: error.message });
  }
};

const update = async (req, res) => {
  const { UserName } = req.params;
  try {
    const updated = await taiKhoanService.update(UserName, req.body);
    res.status(200).json({ message: "Cập nhật thành công", data: updated });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const findByUserName = async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.status(400).json({ message: "Chưa nhập username" });
  }
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await taiKhoanService.findByUserName(keyword, offset, limit);
    const totalPages = Math.ceil(count / limit);
    if (rows.length === 0 ) return res.status(404).json({ message: 'Không tìm thấy tài khoản nào' });


    res.json({
      totalPages,
      page,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách tài khoản", error: error.message });
  }
};

const changePassword = async (req, res) => {
  const { UserName } = req.params;
  try {
    await taiKhoanService.changePassword(UserName, req.body);
    res.status(200).json({ message: "Cập nhật thành công" });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  update,
  findByUserName,
  changePassword,
};
