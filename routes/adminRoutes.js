const express = require('express');
const {
  getAllUsers,
  getUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.get('/stats', getDashboardStats);

router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

module.exports = router;
