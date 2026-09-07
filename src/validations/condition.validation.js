import Joi from "joi";

const qaItem = Joi.object({
  question: Joi.string().trim().min(1).max(500).required(),
  answer: Joi.string().trim().min(1).max(5000).required(),
});

const conditionFields = {
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(120),
  title: Joi.string().trim().min(1).max(200),
  section: Joi.string().trim().min(1).max(120),
  displayOrder: Joi.number().integer().min(0),
  isActive: Joi.boolean(),
  showInNav: Joi.boolean(),
  emoji: Joi.string().trim().max(16).allow(""),
  accent: Joi.string().trim().max(30).allow(""),
  image: Joi.string().trim().max(2000).allow(""),
  intro: Joi.string().trim().max(5000).allow(""),
  qa: Joi.array().items(qaItem).max(20),
};

export const createConditionSchema = Joi.object({
  title: conditionFields.title.required(),
  slug: conditionFields.slug,
  section: conditionFields.section.required(),
  displayOrder: conditionFields.displayOrder,
  isActive: conditionFields.isActive,
  showInNav: conditionFields.showInNav,
  emoji: conditionFields.emoji,
  accent: conditionFields.accent,
  image: conditionFields.image,
  intro: conditionFields.intro,
  qa: conditionFields.qa,
});

export const updateConditionSchema = Joi.object({
  title: conditionFields.title,
  slug: conditionFields.slug,
  section: conditionFields.section,
  displayOrder: conditionFields.displayOrder,
  isActive: conditionFields.isActive,
  showInNav: conditionFields.showInNav,
  emoji: conditionFields.emoji,
  accent: conditionFields.accent,
  image: conditionFields.image,
  intro: conditionFields.intro,
  qa: conditionFields.qa,
}).min(1);
