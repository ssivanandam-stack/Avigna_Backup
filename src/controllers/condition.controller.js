import Condition from "../models/Condition.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { DEFAULT_CONDITIONS } from "../data/defaultConditions.js";
import { uploadFileToS3, getFileObject } from "../services/s3.service.js";

const slugify = (title = "") =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/** Seed any missing default treatments so previous site content is always editable. */
export const ensureDefaultConditions = async () => {
  const existing = await Condition.find({}, { slug: 1 }).lean();
  const existingSlugs = new Set(existing.map((c) => c.slug));
  const missing = DEFAULT_CONDITIONS.filter((c) => !existingSlugs.has(c.slug));
  if (missing.length === 0) return;
  await Condition.insertMany(missing);
};

// @desc    Get active conditions (public nav + listing)
// @route   GET /api/conditions
// @access  Public
export const getConditions = catchAsync(async (req, res) => {
  await ensureDefaultConditions();

  const conditions = await Condition.find({ isActive: true }).sort({
    displayOrder: 1,
    createdAt: 1,
  });

  res
    .status(200)
    .json(new ApiResponse(200, conditions, "Conditions fetched successfully"));
});

// @desc    Serve an uploaded condition image by streaming it from S3
// @route   GET /api/conditions/image?key=conditions/...
// @access  Public
export const getConditionImage = catchAsync(async (req, res) => {
  const { key } = req.query;

  if (!key || typeof key !== "string" || !key.startsWith("conditions/")) {
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

// @desc    Upload a condition cover image
// @route   POST /api/conditions/upload-image
// @access  Private/Admin
export const uploadConditionImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image file provided");
  }

  const { url, key } = await uploadFileToS3(req.file, "conditions");

  res
    .status(201)
    .json(new ApiResponse(201, { url, key }, "Image uploaded successfully"));
});

// @desc    Get a single active condition by slug
// @route   GET /api/conditions/:slug
// @access  Public
export const getConditionBySlug = catchAsync(async (req, res) => {
  await ensureDefaultConditions();

  const condition = await Condition.findOne({
    slug: req.params.slug,
    isActive: true,
  });

  if (!condition) throw new ApiError(404, "Condition not found");

  res
    .status(200)
    .json(new ApiResponse(200, condition, "Condition fetched successfully"));
});

// @desc    Get all conditions (admin)
// @route   GET /api/conditions/admin/all
// @access  Private/Admin
export const getAdminConditions = catchAsync(async (req, res) => {
  await ensureDefaultConditions();

  const conditions = await Condition.find().sort({
    displayOrder: 1,
    createdAt: 1,
  });

  res
    .status(200)
    .json(new ApiResponse(200, conditions, "Conditions fetched successfully"));
});

// @desc    Create a condition
// @route   POST /api/conditions
// @access  Private/Admin
export const createCondition = catchAsync(async (req, res) => {
  const slug = (req.body.slug || slugify(req.body.title)).trim();
  if (!slug) throw new ApiError(400, "A valid slug is required");

  const existing = await Condition.findOne({ slug });
  if (existing)
    throw new ApiError(400, "A condition with this slug already exists");

  const maxOrder = await Condition.findOne()
    .sort({ displayOrder: -1 })
    .select("displayOrder");

  const displayOrder =
    req.body.displayOrder ?? (maxOrder ? maxOrder.displayOrder + 1 : 0);

  const condition = await Condition.create({
    ...req.body,
    slug,
    displayOrder,
  });

  res
    .status(201)
    .json(new ApiResponse(201, condition, "Condition created successfully"));
});

// @desc    Update a condition
// @route   PUT /api/conditions/:id
// @access  Private/Admin
export const updateCondition = catchAsync(async (req, res) => {
  const updates = { ...req.body };

  if (updates.slug) {
    updates.slug = updates.slug.trim().toLowerCase();
    const conflict = await Condition.findOne({
      slug: updates.slug,
      _id: { $ne: req.params.id },
    });
    if (conflict)
      throw new ApiError(400, "A condition with this slug already exists");
  }

  const condition = await Condition.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!condition) throw new ApiError(404, "Condition not found");

  res
    .status(200)
    .json(new ApiResponse(200, condition, "Condition updated successfully"));
});

// @desc    Delete a condition
// @route   DELETE /api/conditions/:id
// @access  Private/Admin
export const deleteCondition = catchAsync(async (req, res) => {
  const condition = await Condition.findByIdAndDelete(req.params.id);
  if (!condition) throw new ApiError(404, "Condition not found");

  res
    .status(200)
    .json(new ApiResponse(200, condition, "Condition deleted successfully"));
});
