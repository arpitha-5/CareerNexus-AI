import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  getAdminOverview,
  listUsers,
  updateUser,
  getPendingCourses,
  approveCourse,
  getPendingInternships,
  approveInternship,
  getForumModeration,
  deleteForumPost,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('admin'));

router.get('/overview', getAdminOverview);
router.get('/users', listUsers);
router.put('/users/:id', updateUser);
router.get('/courses/pending', getPendingCourses);
router.put('/courses/:id/approve', approveCourse);
router.get('/internships/pending', getPendingInternships);
router.put('/internships/:id/approve', approveInternship);
router.get('/forum/moderate', getForumModeration);
router.delete('/forum/posts/:id', deleteForumPost);

export default router;
