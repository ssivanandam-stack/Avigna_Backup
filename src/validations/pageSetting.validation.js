import Joi from "joi";

export const updatePageSettingSchema = Joi.object({
  heroImage: Joi.string().trim().max(2000).allow(""),
}).min(1);
