import { Router } from 'express';
import { create, findAll, findOne, updateOne, deleteOne } from '../controllers/project.controller';
import checkAuth from '../middleware/check-auth.middleware';
import { projectValidationRules, validate } from '../middleware/validation.middleware';

export class ProjectRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    // /api/v2/projects
    this.router
      .route('/')
      .post(checkAuth, projectValidationRules(), validate, create)
      .get(checkAuth, findAll);

    // /api/v2/projects/:id
    this.router
      .route('/:id')
      .get(checkAuth, findOne)
      .put(checkAuth, projectValidationRules(), validate, updateOne)
      .delete(checkAuth, deleteOne);
  }
}
