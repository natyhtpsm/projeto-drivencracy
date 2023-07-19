import { Router } from 'express';
import { pollController, getpollController } from '../controllers/poll.controller.js';
import pollMiddleware  from '../middlewares/poll.middleware.js';

export const pollRouter = Router();

pollRouter.post('/poll', pollMiddleware, pollController);
pollRouter.get('/poll', getpollController);