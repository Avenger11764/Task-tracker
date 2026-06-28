import express from 'express';
import Task from '../models/Task.js';
import { getDBStatus } from '../config/db.js';

const router = express.Router();

let memoryTasks = [
  {
    _id: 'mem_1',
    title: 'Welcome to Task Tracker!',
    description: 'This is a sample task to get you started. Try editing or deleting it!',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mem_2',
    title: 'Explore the statistics dashboard',
    description: 'Check out the visual stats at the top of the page reflecting your tasks.',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mem_3',
    title: 'Connect to MongoDB Database',
    description: 'Ensure a MongoDB instance is running at mongodb://127.0.0.1:27017 to persist data automatically.',
    status: 'completed',
    priority: 'low',
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
];

const validateTask = (data) => {
  const errors = {};
  if (!data.title || data.title.trim() === '') {
    errors.title = 'Task title is required';
  } else if (data.title.length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }

  if (data.description && data.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters';
  }

  if (data.status && !['pending', 'in-progress', 'completed'].includes(data.status)) {
    errors.status = 'Invalid status value';
  }

  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.priority = 'Invalid priority value';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

router.get('/status', (req, res) => {
  res.json({
    connected: getDBStatus(),
    mode: getDBStatus() ? 'MongoDB' : 'In-Memory Fallback'
  });
});

router.get('/', async (req, res) => {
  const { status, priority, search, sortBy } = req.query;

  if (getDBStatus()) {
    try {
      let query = {};
      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }

      let sortOptions = { createdAt: -1 };
      if (sortBy === 'dueDate') {
        sortOptions = { dueDate: 1 };
      }

      let tasks = await Task.find(query).sort(sortOptions);

      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      }

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving tasks', error: error.message });
    }
  } else {
    let tasks = [...memoryTasks];

    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }
    if (priority) {
      tasks = tasks.filter(t => t.priority === priority);
    }
    if (search) {
      const s = search.toLowerCase();
      tasks = tasks.filter(t => t.title.toLowerCase().includes(s) || (t.description && t.description.toLowerCase().includes(s)));
    }

    if (sortBy === 'dueDate') {
      tasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    } else {
      tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json(tasks);
  }
});

router.post('/', async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const { isValid, errors } = validateTask(req.body);

  if (!isValid) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  if (getDBStatus()) {
    try {
      const newTask = new Task({
        title,
        description,
        status: status || 'pending',
        priority: priority || 'medium',
        dueDate
      });
      const savedTask = await newTask.save();
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(500).json({ message: 'Error creating task', error: error.message });
    }
  } else {
    const newMemoryTask = {
      _id: `mem_${Date.now()}`,
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString()
    };
    memoryTasks.push(newMemoryTask);
    res.status(201).json(newMemoryTask);
  }
});

router.put('/:id', async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const { isValid, errors } = validateTask(req.body);

  if (!isValid) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  if (getDBStatus()) {
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { title, description, status, priority, dueDate },
        { new: true, runValidators: true }
      );
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: 'Error updating task', error: error.message });
    }
  } else {
    const taskIndex = memoryTasks.findIndex(t => t._id === req.params.id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedMemoryTask = {
      ...memoryTasks[taskIndex],
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || memoryTasks[taskIndex].status,
      priority: priority || memoryTasks[taskIndex].priority,
      dueDate: dueDate || null
    };

    memoryTasks[taskIndex] = updatedMemoryTask;
    res.json(updatedMemoryTask);
  }
});

router.delete('/:id', async (req, res) => {
  if (getDBStatus()) {
    try {
      const deletedTask = await Task.findByIdAndDelete(req.params.id);
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json({ message: 'Task deleted successfully', id: req.params.id });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
  } else {
    const taskIndex = memoryTasks.findIndex(t => t._id === req.params.id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const deletedId = memoryTasks[taskIndex]._id;
    memoryTasks.splice(taskIndex, 1);
    res.json({ message: 'Task deleted successfully', id: deletedId });
  }
});

export default router;
