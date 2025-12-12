const express = require('express');
const router = express.Router();
const controller = require('../controllers/nhanvienController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { validateCreateNV, validateUpdateNV, validateSearchNV } = require('../middleware/nhanvienMiddleware');

router.get('/', authenticateToken, authorizeRoles('admin', 'quanly'), controller.getAll);
router.get('/search', authenticateToken, authorizeRoles('admin', 'quanly'), validateSearchNV, controller.findByMaNVOrTen);
router.get('/detail/:MaNV', authenticateToken, authorizeRoles('admin', 'quanly'), controller.getById);
router.post('/create', authenticateToken, authorizeRoles('admin'), validateCreateNV, controller.create);
router.put('/update/:MaNV', authenticateToken, authorizeRoles('admin', 'quanly'), validateUpdateNV, controller.update);
router.delete('/delete/:MaNV', authenticateToken, authorizeRoles('admin'), controller.remove);

module.exports = router;

