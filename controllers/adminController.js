const User = require('../models/User');
const Material = require('../models/Material');

// Get all users with pagination
async function getUsers(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
}

// Update user role
async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}

// Delete user
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user.id === id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
}

// Get dashboard stats
async function getDashboardStats(req, res, next) {
  try {
    const totalUsers = await User.countDocuments();
    const totalMaterials = await Material.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const studentUsers = await User.countDocuments({ role: 'student' });

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const recentMaterials = await Material.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    res.json({
      totalUsers,
      totalMaterials,
      adminUsers,
      studentUsers,
      recentUsers,
      recentMaterials
    });
  } catch (err) {
    next(err);
  }
}

// Get user activity reports
async function getUserReports(req, res, next) {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'materials',
          localField: '_id',
          foreignField: 'author',
          as: 'materials'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          createdAt: 1,
          materialCount: { $size: '$materials' }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser,
  getDashboardStats,
  getUserReports
};