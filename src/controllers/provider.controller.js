import { catchAsync } from "../utils/catchAsync.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import * as providerService from "../services/provider.service.js";
import { uploadFileToS3, getFileObject } from "../services/s3.service.js";

// ─── PUBLIC ──────────────────────────────────────────────────────────

// @desc    Get all active providers (public team page)
// @route   GET /api/providers
// @access  Public
export const getProviders = catchAsync(async (req, res) => {
  const providers = await providerService.getActiveProviders();

  res.status(200).json(
    new ApiResponse(200, providers, "Providers fetched successfully"),
  );
});

// @desc    Get a single active provider profile
// @route   GET /api/providers/:id
// @access  Public
export const getProviderById = catchAsync(async (req, res) => {
  const provider = await providerService.getActiveProviderById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, provider, "Provider fetched successfully"),
  );
});

// @desc    Serve an uploaded provider image by streaming it from S3
// @route   GET /api/providers/image?key=providers/...
// @access  Public
export const getProviderImage = catchAsync(async (req, res) => {
  const { key } = req.query;

  // Only allow keys within the providers/ prefix so this cannot be abused
  // to read private objects (e.g. resumes/).
  if (!key || typeof key !== "string" || !key.startsWith("providers/")) {
    throw new ApiError(400, "Invalid image key");
  }

  let file;
  try {
    file = await getFileObject(key);
  } catch (err) {
    throw new ApiError(404, "Image not found");
  }

  // Helmet defaults to Cross-Origin-Resource-Policy: same-origin, which
  // blocks <img> tags on the frontend (different origin/port) from showing
  // the image even when this endpoint returns 200.
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

// ─── ADMIN ───────────────────────────────────────────────────────────

// @desc    Get all providers (admin)
// @route   GET /api/admin/providers
// @access  Private/Admin
export const getAdminProviders = catchAsync(async (req, res) => {
  const includeDeleted = req.query.includeDeleted === "true";
  const providers = await providerService.getAdminProviders({ includeDeleted });

  res.status(200).json(
    new ApiResponse(200, providers, "Providers fetched successfully"),
  );
});

// @desc    Create a provider
// @route   POST /api/admin/providers
// @access  Private/Admin
export const createProvider = catchAsync(async (req, res) => {
  const provider = await providerService.createProvider(req.body);

  res.status(201).json(
    new ApiResponse(201, provider, "Provider created successfully"),
  );
});

// @desc    Update a provider (includes activate/inactivate via status)
// @route   PUT /api/admin/providers/:id
// @access  Private/Admin
export const updateProvider = catchAsync(async (req, res) => {
  const provider = await providerService.updateProvider(
    req.params.id,
    req.body,
  );

  res.status(200).json(
    new ApiResponse(200, provider, "Provider updated successfully"),
  );
});

// @desc    Soft delete a provider
// @route   DELETE /api/admin/providers/:id
// @access  Private/Admin
export const deleteProvider = catchAsync(async (req, res) => {
  const provider = await providerService.softDeleteProvider(req.params.id);

  res.status(200).json(
    new ApiResponse(200, provider, "Provider deleted successfully"),
  );
});

// @desc    Upload a provider profile image
// @route   POST /api/admin/providers/upload-image
// @access  Private/Admin
export const uploadProviderImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image file provided");
  }

  const { url, key } = await uploadFileToS3(req.file, "providers");

  res.status(201).json(
    new ApiResponse(201, { url, key }, "Image uploaded successfully"),
  );
});

// @desc    Reorder providers
// @route   PATCH /api/admin/providers/reorder
// @access  Private/Admin
export const reorderProviders = catchAsync(async (req, res) => {
  const providers = await providerService.reorderProviders(
    req.body.providers,
  );

  res.status(200).json(
    new ApiResponse(200, providers, "Providers reordered successfully"),
  );
});
