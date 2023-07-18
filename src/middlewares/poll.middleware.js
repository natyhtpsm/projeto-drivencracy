import { pollSchema } from "../schemas/poll.schema.js";

export default function PostPollMiddleware(req, res, next) {
    const { title, expireAt } = req.body;
    const poll = { title, expireAt };
    const validationPoll = pollSchema.validate(poll);
  
    if (validationPoll.error) {
        res.status(422).send(validationPoll.error.details[0].message);
        return;
    } 
    next();
}
