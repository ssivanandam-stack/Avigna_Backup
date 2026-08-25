import Joi from "joi";

const qaItem = Joi.object({
  question: Joi.string().trim().min(1).max(500).required(),
  answer: Joi.string().trim().min(1).max(5000).required(),
});

const serviceFields = {
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
  accent: Joi.string().trim().max(30).allow(""),
  image: Joi.string().trim().max(2000).allow(""),
  intro: Joi.string().trim().max(5000).allow(""),
  qa: Joi.array().items(qaItem).max(20),
};

export const createServiceSchema = Joi.object({
  title: serviceFields.title.required(),
  slug: serviceFields.slug,
  section: serviceFields.section.required(),
  displayOrder: serviceFields.displayOrder,
  isActive: serviceFields.isActive,
  showInNav: serviceFields.showInNav,
  accent: serviceFields.accent,
  image: serviceFields.image,
  intro: serviceFields.intro,
  qa: serviceFields.qa,
});

export const updateServiceSchema = Joi.object({
  title: serviceFields.title,
  slug: serviceFields.slug,
  section: serviceFields.section,
  displayOrder: serviceFields.displayOrder,
  isActive: serviceFields.isActive,
  showInNav: serviceFields.showInNav,
  accent: serviceFields.accent,
  image: serviceFields.image,
  intro: serviceFields.intro,
  qa: serviceFields.qa,
}).min(1);
