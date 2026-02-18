const express = require('express');
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');
const { createTaskValidator, updateTaskValidator } = require('../middleware/validation.middleware');

// All routes below are protected
router.use(protect);

// GET /api/tasks/stats  (must be before /:id to avoid conflict)
router.get('/stats', getTaskStats);

// POST /api/tasks
router.post('/', createTaskValidator, createTask);

// GET /api/tasks
router.get('/', getTasks);

// GET /api/tasks/:id
router.get('/:id', getTaskById);

// PUT /api/tasks/:id
router.put('/:id', updateTaskValidator, updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

module.exports = router;
