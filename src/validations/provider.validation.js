import Joi from "joi";

const providerFields = {
  firstName: Joi.string().trim().allow("").max(100),
  lastName: Joi.string().trim().allow("").max(100),
  displayName: Joi.string().trim().min(2).max(200),
  credentials: Joi.string().trim().allow("").max(500),
  designation: Joi.string().trim().min(2).max(200),
  specialty: Joi.string().trim().min(2).max(200),
  section: Joi.string().trim().allow("").max(100),
  shortBio: Joi.string().trim().allow("").max(1500),
  fullBio: Joi.string().trim().allow("").max(5000),
  profileImageUrl: Joi.alternatives().try(
    Joi.string().uri(),
    Joi.string().valid(""),
  ),
  email: Joi.alternatives().try(Joi.string().trim().email(), Joi.string().valid("")),
  phone: Joi.string().trim().allow("").max(30),
  location: Joi.string().trim().allow("").max(200),
  yearsOfExperience: Joi.number().integer().min(0).allow(null),
  languages: Joi.array().items(Joi.string().trim().min(1).max(50)),
  displayOrder: Joi.number().integer().min(0),
  isFeatured: Joi.boolean(),
  status: Joi.string().valid("Active", "Inactive"),
};

export const createProviderSchema = Joi.object({
  firstName: providerFields.firstName,
  lastName: providerFields.lastName,
  displayName: providerFields.displayName.required(),
  credentials: providerFields.credentials,
  designation: providerFields.designation.required(),
  specialty: providerFields.specialty.required(),
  section: providerFields.section,
  shortBio: providerFields.shortBio,
  fullBio: providerFields.fullBio,
  profileImageUrl: providerFields.profileImageUrl,
  email: providerFields.email,
  phone: providerFields.phone,
  location: providerFields.location,
  yearsOfExperience: providerFields.yearsOfExperience,
  languages: providerFields.languages.default([]),
  displayOrder: providerFields.displayOrder,
  isFeatured: providerFields.isFeatured,
  status: providerFields.status,
});

export const updateProviderSchema = Joi.object({
  firstName: providerFields.firstName,
  lastName: providerFields.lastName,
  displayName: providerFields.displayName,
  credentials: providerFields.credentials,
  designation: providerFields.designation,
  specialty: providerFields.specialty,
  section: providerFields.section,
  shortBio: providerFields.shortBio,
  fullBio: providerFields.fullBio,
  profileImageUrl: providerFields.profileImageUrl,
  email: providerFields.email,
  phone: providerFields.phone,
  location: providerFields.location,
  yearsOfExperience: providerFields.yearsOfExperience,
  languages: providerFields.languages,
  displayOrder: providerFields.displayOrder,
  isFeatured: providerFields.isFeatured,
  status: providerFields.status,
}).min(1);

export const reorderProvidersSchema = Joi.object({
  providers: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        displayOrder: Joi.number().integer().min(0).required(),
      }),
    )
    .min(1)
    .required(),
});
