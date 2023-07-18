import { choiceSchema } from "../schemas/choice.schema";

export function choiceMiddleware(req, res, next){
    const {title, pollId} = req.body;
    const choice = { title, pollId}
    const validationChoice = choiceSchema.validate(choice);

    if(validationChoice.error){
        res.status(422).json({message: error.message});
        return;
    }
    next();
}