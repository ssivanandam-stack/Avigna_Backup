import Joi from "joi";

export const createInquirySchema = Joi.object({
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  message: Joi.string().required().min(10),
  permissionGranted: Joi.boolean().required().valid(true),
});
