const express = require('express');
const router = express.Router();
const controller = require('../controllers/taikhoanController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { validateUpdateTK, validateChangePassword, validateSearchTK } = require('../middleware/taikhoanMiddleware');

router.get('/', authenticateToken, authorizeRoles('admin'), controller.getAll);
router.get('/search', authenticateToken, authorizeRoles('admin'), validateSearchTK, controller.findByUserName);
router.get('/detail/:UserName', authenticateToken, authorizeRoles('admin'), controller.getById);
router.put('/update/:UserName', authenticateToken, authorizeRoles('admin'), validateUpdateTK, controller.update);
router.put('/changepassword/:UserName', authenticateToken, validateChangePassword, controller.changePassword);

module.exports = router;