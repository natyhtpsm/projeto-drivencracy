import joi from 'joi';

export const pollSchema = joi.object().keys({
    title: joi.string().min(1).required(),
    expireAt: joi.optional(),
});