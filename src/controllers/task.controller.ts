import { Task } from '../schemas/task.schema';
import { Request, Response } from 'express';
import asyncWrapper from '../utils/async-wrapper';

// Create a new task and store it into DB
export const create = asyncWrapper(
  async (req: Request, res: Response): Promise<Response> => {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      creator: (req as any).userData.userId
    });

    return res.status(201).json({ message: 'Task added successfully', task });
  }
);

// Get all tasks from DB
export const findAll = asyncWrapper(
  async (req: Request, res: Response): Promise<Response> => {
    const tasks = await Task.find({ creator: (req as any).userData.userId });

    return res.status(200).json({ message: 'Loading tasks successfully', tasks });
  }
);

// Get a single task from DB
export const findOne = asyncWrapper(
  async (req: Request, res: Response): Promise<Response> => {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  }
);

// Update task on DB
export const updateOne = asyncWrapper(
  async (req: Request, res: Response): Promise<Response> => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated', task });
  }
);

// Delete task from DB
export const deleteOne = asyncWrapper(
  async (req: Request, res: Response): Promise<Response> => {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(204).json({ message: 'Task deleted' });
  }
);
