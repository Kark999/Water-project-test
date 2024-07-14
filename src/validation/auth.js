import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  name: Joi.string(),
  gender: Joi.string().valid('man', 'woman'),
  dailyNorma: Joi.number().min(0).max(10000),
  weight: Joi.number().min(0),
  activeHours: Joi.number().min(0).max(12),
  userId: Joi.string(),
  avatar: Joi.string(),
});
