const express = require('express');
const router = express.Router();
const controller = require('../controllers/nhaccController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { validateCreateNCC, validateUpdateNCC, validateSearchNCC } = require('../middleware/nhaccMiddleware');

router.get('/', authenticateToken, authorizeRoles('admin', 'quanly', 'thukho', 'nhanvien'), controller.getAll);
router.get('/search', authenticateToken, authorizeRoles('admin', 'quanly', 'thukho', 'nhanvien'), validateSearchNCC, controller.findByMaNCCOrTen);
router.get('/detail/:MaNCC', authenticateToken, authorizeRoles('admin', 'quanly', 'thukho', 'nhanvien'), controller.getById);
router.post('/create', authenticateToken, authorizeRoles('admin', 'quanly'), validateCreateNCC, controller.create);
router.put('/update/:MaNCC', authenticateToken, authorizeRoles('admin', 'quanly'), validateUpdateNCC, controller.update);
router.get('/supplierhistory/:MaNCC', authenticateToken, authorizeRoles('admin', 'quanly'), controller.supplierHistory);

module.exports = router;