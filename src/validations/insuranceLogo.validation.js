import Joi from "joi";

const fields = {
  name: Joi.string().trim().min(1).max(120),
  imageUrl: Joi.string().trim().min(1).max(2000),
  displayOrder: Joi.number().integer().min(0),
  isActive: Joi.boolean(),
};

export const createInsuranceLogoSchema = Joi.object({
  name: fields.name.required(),
  imageUrl: fields.imageUrl.required(),
  displayOrder: fields.displayOrder,
  isActive: fields.isActive,
});

export const updateInsuranceLogoSchema = Joi.object({
  name: fields.name,
  imageUrl: fields.imageUrl,
  displayOrder: fields.displayOrder,
  isActive: fields.isActive,
}).min(1);
