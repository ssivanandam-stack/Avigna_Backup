import Joi from "joi";

export const createCareerSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(200),
  type: Joi.string()
    .required()
    .valid("Full-time", "Part-time", "Contract", "Per Diem", "Internship"),
  location: Joi.string().required().trim(),
  department: Joi.string().required().trim(),
  description: Joi.string().required().min(20),
  responsibilities: Joi.array().items(Joi.string().trim()).default([]),
  qualifications: Joi.array().items(Joi.string().trim()).default([]),
  benefits: Joi.array().items(Joi.string().trim()).default([]),
  salaryMin: Joi.number().positive().allow(null).default(null),
  salaryMax: Joi.number().positive().allow(null).default(null),
  salaryType: Joi.string().valid("hourly", "yearly").default("yearly"),
  applicationDeadline: Joi.date().allow(null).default(null),
  accentColor: Joi.string()
    .pattern(/^#[0-9a-fA-F]{6}$/)
    .default("#14b8a6"),
});

export const updateCareerSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200),
  type: Joi.string().valid(
    "Full-time",
    "Part-time",
    "Contract",
    "Per Diem",
    "Internship",
  ),
  location: Joi.string().trim(),
  department: Joi.string().trim(),
  description: Joi.string().min(20),
  responsibilities: Joi.array().items(Joi.string().trim()),
  qualifications: Joi.array().items(Joi.string().trim()),
  benefits: Joi.array().items(Joi.string().trim()),
  salaryMin: Joi.number().positive().allow(null),
  salaryMax: Joi.number().positive().allow(null),
  salaryType: Joi.string().valid("hourly", "yearly"),
  applicationDeadline: Joi.date().allow(null),
  accentColor: Joi.string().pattern(/^#[0-9a-fA-F]{6}$/),
  isActive: Joi.boolean(),
}).min(1); // At least one field must be provided

export const submitApplicationSchema = Joi.object({
  firstName: Joi.string().required().trim().min(1).max(100),
  lastName: Joi.string().required().trim().min(1).max(100),
  email: Joi.string().email().required().trim(),
  phone: Joi.string().trim().allow("").max(20),
  coverLetter: Joi.string().allow("").max(5000),
});
