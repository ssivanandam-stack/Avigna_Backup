import Service from "../models/Service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { DEFAULT_SERVICES } from "../data/defaultServices.js";
import { uploadFileToS3, getFileObject } from "../services/s3.service.js";

const slugify = (title = "") =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/** Seed existing site services once if the collection is empty. */
export const ensureDefaultServices = async () => {
  const count = await Service.countDocuments();
  if (count > 0) return;
  await Service.insertMany(DEFAULT_SERVICES);
};

// @desc    Get active services (public nav + listing)
// @route   GET /api/services
// @access  Public
export const getServices = catchAsync(async (req, res) => {
  await ensureDefaultServices();

  const services = await Service.find({ isActive: true }).sort({
    displayOrder: 1,
    createdAt: 1,
  });

  res
    .status(200)
    .json(new ApiResponse(200, services, "Services fetched successfully"));
});

// @desc    Serve an uploaded service image by streaming it from S3
// @route   GET /api/services/image?key=services/...
// @access  Public
export const getServiceImage = catchAsync(async (req, res) => {
  const { key } = req.query;

  if (!key || typeof key !== "string" || !key.startsWith("services/")) {
    throw new ApiError(400, "Invalid image key");
  }

  let file;
  try {
    file = await getFileObject(key);
  } catch (err) {
    throw new ApiError(404, "Image not found");
  }

  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader(
    "Content-Type",
    file.contentType || "application/octet-stream",
  );
  res.setHeader("Cache-Control", "public, max-age=86400, immutable");

  const bytes = await file.body.transformToByteArray();
  res.setHeader("Content-Length", bytes.byteLength);
  res.end(Buffer.from(bytes));
});

// @desc    Upload a service cover image
// @route   POST /api/services/upload-image
// @access  Private/Admin
export const uploadServiceImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image file provided");
  }

  const { url, key } = await uploadFileToS3(req.file, "services");

  res
    .status(201)
    .json(new ApiResponse(201, { url, key }, "Image uploaded successfully"));
});

// @desc    Get a single active service by slug
// @route   GET /api/services/:slug
// @access  Public
export const getServiceBySlug = catchAsync(async (req, res) => {
  await ensureDefaultServices();

  const service = await Service.findOne({
    slug: req.params.slug,
    isActive: true,
  });

  if (!service) throw new ApiError(404, "Service not found");

  res
    .status(200)
    .json(new ApiResponse(200, service, "Service fetched successfully"));
});

// @desc    Get all services (admin)
// @route   GET /api/services/admin/all
// @access  Private/Admin
export const getAdminServices = catchAsync(async (req, res) => {
  await ensureDefaultServices();

  const services = await Service.find().sort({
    displayOrder: 1,
    createdAt: 1,
  });

  res
    .status(200)
    .json(new ApiResponse(200, services, "Services fetched successfully"));
});

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
export const createService = catchAsync(async (req, res) => {
  const slug = (req.body.slug || slugify(req.body.title)).trim();
  if (!slug) throw new ApiError(400, "A valid slug is required");

  const existing = await Service.findOne({ slug });
  if (existing) throw new ApiError(400, "A service with this slug already exists");

  const maxOrder = await Service.findOne()
    .sort({ displayOrder: -1 })
    .select("displayOrder");

  const displayOrder =
    req.body.displayOrder ?? (maxOrder ? maxOrder.displayOrder + 1 : 0);

  const service = await Service.create({
    ...req.body,
    slug,
    displayOrder,
  });

  res
    .status(201)
    .json(new ApiResponse(201, service, "Service created successfully"));
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateService = catchAsync(async (req, res) => {
  const updates = { ...req.body };

  if (updates.slug) {
    updates.slug = updates.slug.trim().toLowerCase();
    const conflict = await Service.findOne({
      slug: updates.slug,
      _id: { $ne: req.params.id },
    });
    if (conflict) throw new ApiError(400, "A service with this slug already exists");
  }

  const service = await Service.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!service) throw new ApiError(404, "Service not found");

  res
    .status(200)
    .json(new ApiResponse(200, service, "Service updated successfully"));
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = catchAsync(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) throw new ApiError(404, "Service not found");

  res
    .status(200)
    .json(new ApiResponse(200, service, "Service deleted successfully"));
});
