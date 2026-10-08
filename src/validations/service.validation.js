import Joi from "joi";

const qaItem = Joi.object({
  question: Joi.string().trim().min(1).max(500).required(),
  answer: Joi.string().trim().min(1).max(5000).required(),
});

const pricingItem = Joi.object({
  label: Joi.string().trim().min(1).max(300).required(),
  price: Joi.string().trim().min(1).max(80).required(),
  note: Joi.string().trim().max(80).allow(""),
});

const programItem = Joi.object({
  tabName: Joi.string().trim().min(1).max(120).required(),
  title: Joi.string().trim().min(1).max(200).required(),
  icon: Joi.string()
    .valid("brain", "heart", "clipboard", "stethoscope", "users")
    .default("brain"),
  accentColor: Joi.string().trim().max(30).allow(""),
  about: Joi.string().trim().max(8000).allow(""),
  whoItHelps: Joi.array().items(Joi.string().trim().max(500)).max(30),
  whatsIncluded: Joi.array().items(Joi.string().trim().max(500)).max(40),
  pricing: Joi.array().items(pricingItem).max(20),
  image: Joi.string().trim().max(2000).allow(""),
  qa: Joi.array().items(qaItem).max(20),
  ctaLabel: Joi.string().trim().max(120).allow(""),
  ctaUrl: Joi.string().trim().max(500).allow(""),
  displayOrder: Joi.number().integer().min(0),
  isActive: Joi.boolean(),
  _id: Joi.any(),
  id: Joi.any(),
});

const serviceFields = {
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(120),
  title: Joi.string().trim().min(1).max(200),
  section: Joi.string().trim().min(1).max(120),
  templateType: Joi.string().valid("standard", "specialized"),
  displayOrder: Joi.number().integer().min(0),
  isActive: Joi.boolean(),
  showInNav: Joi.boolean(),
  accent: Joi.string().trim().max(30).allow(""),
  image: Joi.string().trim().max(2000).allow(""),
  intro: Joi.string().trim().max(5000).allow(""),
  specializedHeading: Joi.string().trim().max(200).allow(""),
  specializedIntro: Joi.string().trim().max(2000).allow(""),
  qa: Joi.array().items(qaItem).max(20),
  programs: Joi.array().items(programItem).max(20),
};

export const createServiceSchema = Joi.object({
  title: serviceFields.title.required(),
  slug: serviceFields.slug,
  section: serviceFields.section.required(),
  templateType: serviceFields.templateType,
  displayOrder: serviceFields.displayOrder,
  isActive: serviceFields.isActive,
  showInNav: serviceFields.showInNav,
  accent: serviceFields.accent,
  image: serviceFields.image,
  intro: serviceFields.intro,
  specializedHeading: serviceFields.specializedHeading,
  specializedIntro: serviceFields.specializedIntro,
  qa: serviceFields.qa,
  programs: serviceFields.programs,
});

export const updateServiceSchema = Joi.object({
  title: serviceFields.title,
  slug: serviceFields.slug,
  section: serviceFields.section,
  templateType: serviceFields.templateType,
  displayOrder: serviceFields.displayOrder,
  isActive: serviceFields.isActive,
  showInNav: serviceFields.showInNav,
  accent: serviceFields.accent,
  image: serviceFields.image,
  intro: serviceFields.intro,
  specializedHeading: serviceFields.specializedHeading,
  specializedIntro: serviceFields.specializedIntro,
  qa: serviceFields.qa,
  programs: serviceFields.programs,
}).min(1);
