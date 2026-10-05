import Joi from "joi";

const userFields = {
  name: Joi.string().trim().min(1).max(100),
  email: Joi.string().trim().email().lowercase().max(200),
  password: Joi.string().min(8).max(128),
  isActive: Joi.boolean(),
};

export const createAdminUserSchema = Joi.object({
  name: userFields.name.required(),
  email: userFields.email.required(),
  password: userFields.password.required(),
  isActive: userFields.isActive,
});

export const updateAdminUserSchema = Joi.object({
  name: userFields.name,
  email: userFields.email,
  password: userFields.password,
  isActive: userFields.isActive,
}).min(1);
