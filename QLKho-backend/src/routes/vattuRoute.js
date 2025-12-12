const express = require('express');
const router = express.Router();
const controller = require('../controllers/vattuController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { validateUpdateVT, validateCreateVT, validateSearchVT } = require('../middleware/vattuMiddleware');

router.get('/', authenticateToken, authorizeRoles('admin', 'quanly', 'thukho', 'nhanvien'), controller.getAll);
router.get('/search', authenticateToken, authorizeRoles('admin', 'quanly', 'thukho', 'nhanvien'), validateSearchVT, controller.findByMaVTOrTen);
router.get('/detail/:MaVT', authenticateToken, authorizeRoles('admin', 'quanly', 'thukho', 'nhanvien'), controller.getById);
router.post('/create', authenticateToken, authorizeRoles('admin', 'quanly'), validateCreateVT, controller.create);
router.put('/update/:MaVT', authenticateToken, authorizeRoles('admin', 'quanly'), validateUpdateVT, controller.update);
router.delete('/delete/:MaVT', authenticateToken, authorizeRoles('admin', 'quanly'), controller.remove);

module.exports = router;