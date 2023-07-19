import { Router } from "express";
import choiceMiddleware from "../middlewares/choice.middleware.js";
import { choiceController } from "../controllers/choice.controller.js";

export const choiceRouter = Router();

choiceRouter.post('/choice', choiceMiddleware, choiceController); 