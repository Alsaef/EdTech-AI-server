const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// All admin routes require authentication and admin role
router.use(auth.required);
router.use(roles.requireRole('admin'));

// User management
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Dashboard and reports
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/reports/users', adminController.getUserReports);

// Materials are already handled by materialRoutes with admin checks

module.exports = router;