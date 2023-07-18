import joi from 'joi';

export const choiceSchema = joi.object({
    title: joi.string().min(1).required(), 
    pollId: joi.required() 
});

