const { TaiKhoan } =  require("../models");
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");

const getAll = async(offset, limit) => {
    return await TaiKhoan.findAndCountAll({
        offset,
        limit,
        order: [['TrangThai', 'ASC'], ['UserName', 'ASC']]
    });
}

const getById = async(UserName) => {
    if(!UserName) {throw new Error('Chưa có username');}
    return await TaiKhoan.findByPk(UserName);
}

const update = async(UserName, data) => {
    const taiKhoan = await TaiKhoan.findByPk(UserName);
    if(!taiKhoan) throw new Error("Không tìm thấy tài khoản");

    await TaiKhoan.update(data, { where: {UserName} });
    return await TaiKhoan.findByPk(UserName);
};

const findByUserName = async(keyword, offset, limit) => {
    const where = {UserName: {[Op.like]: `%${keyword}%`}};
    return await TaiKhoan.findAndCountAll({
        where,
        offset,
        limit,
        order: [['TrangThai', 'ASC'], ['UserName', 'ASC']]
    });
};

const changePassword = async(UserName, data) => {
    const taiKhoan = await TaiKhoan.findByPk(UserName);
    if(!taiKhoan) throw new Error('Không tìm thấy tài khoản');

    const isMatch = await bcrypt.compare(data.oldPassword, taiKhoan.MatKhau);
    if (!isMatch) {
        throw new Error('Mật khẩu cũ không khớp');
    }    
    
    if(data.newPassword != data.confirmNewPassword) throw new Error('Mật khẩu mới không khớp với xác nhận');
    
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    return await TaiKhoan.update({ MatKhau: hashedPassword}, { where: {UserName} });
};


module.exports = {
    getAll,
    update,
    findByUserName,
    getById,
    changePassword
};