import { Router } from 'express';
import { pollController} from '../controllers/poll.controller.js';
import pollMiddleware  from '../middlewares/poll.middleware.js';

export const pollRouter = Router();

pollRouter.post('/poll', pollMiddleware, pollController);