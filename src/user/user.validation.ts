import Joi from 'joi';

export const CreateUserValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.date().required()
});

export const LoginUserValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const EditUserValidationSchema = Joi.object({
    email: Joi.string().email(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    dateOfBirth: Joi.date()
});
