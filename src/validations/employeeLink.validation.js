import Joi from "joi";

const linkFields = {
  name: Joi.string().trim().min(1).max(100),
  url: Joi.string()
    .trim()
    .uri({ scheme: ["http", "https"] })
    .max(2000),
  displayOrder: Joi.number().integer().min(0),
  isActive: Joi.boolean(),
};

export const createEmployeeLinkSchema = Joi.object({
  name: linkFields.name.required(),
  url: linkFields.url.required(),
  displayOrder: linkFields.displayOrder,
  isActive: linkFields.isActive,
});

export const updateEmployeeLinkSchema = Joi.object({
  name: linkFields.name,
  url: linkFields.url,
  displayOrder: linkFields.displayOrder,
  isActive: linkFields.isActive,
}).min(1);
