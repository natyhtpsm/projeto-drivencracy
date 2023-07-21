import { Router } from 'express';
import { pollController, getpollController, getResultController } from '../controllers/poll.controller.js';
import pollMiddleware  from '../middlewares/poll.middleware.js';

export const pollRouter = Router();

pollRouter.post('/poll', pollMiddleware, pollController);
pollRouter.get('/poll', getpollController);
pollRouter.get('/poll/:id/result', getResultController);