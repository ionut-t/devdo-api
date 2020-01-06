import { Task } from '../schemas/task.schema';
import { Request, Response, NextFunction } from 'express';
import asyncWrapper from '../utils/async-wrapper';
import { Err } from '../utils/error-handler';

/**
 * Create task.
 */
export const create = asyncWrapper(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      project: req.params.projectId,
      creator: (req as any).userData.userId
    });

    res.status(201).json({ message: 'Task added successfully', task });
  }
);

/**
 * Find all tasks.
 */
export const findAll = asyncWrapper(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const tasks = await Task.find({ project: req.params.projectId });

    res.status(200).json({ message: 'Loading tasks successfully', results: tasks.length, tasks });
  }
);

/**
 * Find a single task.
 */
export const findOne = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(new Err('Task not found', 404));
    }

    res.status(200).json(task);
  }
);

/**
 * Update one task.
 */
export const updateOne = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });

    if (!task) {
      return next(new Err('Task not found', 404));
    }

    res.status(200).json({ message: 'Task updated', task });
  }
);

/**
 * Delete task.
 */
export const deleteOne = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return next(new Err('Task not found', 404));
    }

    res.status(204).json({ message: 'Task deleted' });
  }
);
