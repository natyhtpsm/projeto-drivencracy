import { Router } from "express";
import choiceMiddleware from "../middlewares/choice.middleware.js";
import { choiceController, getchoiceController } from "../controllers/choice.controller.js";

export const choiceRouter = Router();

choiceRouter.post('/choice', choiceMiddleware, choiceController); 
choiceRouter.get('/poll/:id/choice', getchoiceController);