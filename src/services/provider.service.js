import mongoose from "mongoose";
import Provider from "../models/Provider.js";
import { ApiError } from "../utils/ApiError.js";

const PUBLIC_LIST_FIELDS =
  "displayName credentials designation specialty section shortBio profileImageUrl location yearsOfExperience languages isFeatured displayOrder";

const PUBLIC_DETAIL_FIELDS =
  "firstName lastName displayName credentials designation specialty section shortBio fullBio profileImageUrl email phone location yearsOfExperience languages isFeatured displayOrder createdAt updatedAt";

const toPublicProvider = (provider) => {
  return provider.toJSON ? provider.toJSON() : provider;
};

const activePublicFilter = {
  status: "Active",
  isDeleted: false,
};

export const getActiveProviders = async () => {
  const providers = await Provider.find(activePublicFilter)
    .select(PUBLIC_LIST_FIELDS)
    .sort({ displayOrder: 1, displayName: 1 });

  return providers.map((provider) => toPublicProvider(provider));
};

export const getActiveProviderById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid provider ID");
  }

  const provider = await Provider.findOne({
    _id: id,
    ...activePublicFilter,
  }).select(PUBLIC_DETAIL_FIELDS);

  if (!provider) {
    throw new ApiError(404, "Provider not found");
  }

  return toPublicProvider(provider);
};

export const getAdminProviders = async ({ includeDeleted = false } = {}) => {
  const filter = includeDeleted ? {} : { isDeleted: false };

  return Provider.find(filter).sort({ displayOrder: 1, displayName: 1 });
};

export const createProvider = async (payload) => {
  const maxOrder = await Provider.findOne({ isDeleted: false })
    .sort({ displayOrder: -1 })
    .select("displayOrder");

  const displayOrder =
    payload.displayOrder ?? (maxOrder ? maxOrder.displayOrder + 1 : 0);

  return Provider.create({
    ...payload,
    displayOrder,
  });
};

export const updateProvider = async (id, payload) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid provider ID");
  }

  const provider = await Provider.findOneAndUpdate(
    { _id: id, isDeleted: false },
    payload,
    { new: true, runValidators: true },
  );

  if (!provider) {
    throw new ApiError(404, "Provider not found");
  }

  return provider;
};

export const softDeleteProvider = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid provider ID");
  }

  const provider = await Provider.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, status: "Inactive" },
    { new: true },
  );

  if (!provider) {
    throw new ApiError(404, "Provider not found");
  }

  return provider;
};

export const reorderProviders = async (items) => {
  const ids = items.map((item) => item.id);

  if (ids.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
    throw new ApiError(400, "One or more provider IDs are invalid");
  }

  const existingCount = await Provider.countDocuments({
    _id: { $in: ids },
    isDeleted: false,
  });

  if (existingCount !== ids.length) {
    throw new ApiError(404, "One or more providers were not found");
  }

  const bulkOps = items.map((item) => ({
    updateOne: {
      filter: { _id: item.id, isDeleted: false },
      update: { $set: { displayOrder: item.displayOrder } },
    },
  }));

  await Provider.bulkWrite(bulkOps);

  return getAdminProviders();
};
