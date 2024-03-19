import Joi from 'joi';

export const signupSchema = Joi.object({
  username: Joi.string().required().min(3).max(64),
  email: Joi.string().required().email().max(100),
  password: Joi.string().required().min(6).max(64),
});

export const loginSchema = Joi.object({
  username: Joi.string().required().min(3).max(64),
  password: Joi.string().required().min(6).max(64),
});
