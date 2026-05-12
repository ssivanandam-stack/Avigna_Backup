import Joi from "joi";

export const createReviewSchema = Joi.object({
  providerName: Joi.string().required(),
  providerRole: Joi.string().required(),
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  wouldRecommend: Joi.boolean().required(),
  feedback: Joi.string().required().min(5),
  rating: Joi.number().min(1).max(5).default(5),
});
