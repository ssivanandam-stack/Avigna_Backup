import InsuranceLogo from "../models/InsuranceLogo.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { DEFAULT_INSURANCE_LOGOS } from "../data/defaultInsuranceLogos.js";
import { uploadFileToS3, getFileObject } from "../services/s3.service.js";

export const ensureDefaultInsuranceLogos = async () => {
  const count = await InsuranceLogo.countDocuments();
  if (count > 0) return;
  await InsuranceLogo.insertMany(DEFAULT_INSURANCE_LOGOS);
};

// @desc    Get active insurance logos (public)
// @route   GET /api/insurance-logos
// @access  Public
export const getInsuranceLogos = catchAsync(async (req, res) => {
  await ensureDefaultInsuranceLogos();

  const logos = await InsuranceLogo.find({ isActive: true }).sort({
    displayOrder: 1,
    createdAt: 1,
  });

  res
    .status(200)
    .json(new ApiResponse(200, logos, "Insurance logos fetched successfully"));
});

// @desc    Serve uploaded insurance logo from S3
// @route   GET /api/insurance-logos/image?key=insurance/...
// @access  Public
export const getInsuranceLogoImage = catchAsync(async (req, res) => {
  const { key } = req.query;

  if (!key || typeof key !== "string" || !key.startsWith("insurance/")) {
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

// @desc    Upload an insurance logo image
// @route   POST /api/insurance-logos/upload-image
// @access  Private/Admin
export const uploadInsuranceLogoImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image file provided");
  }

  const { url, key } = await uploadFileToS3(req.file, "insurance");

  res
    .status(201)
    .json(new ApiResponse(201, { url, key }, "Image uploaded successfully"));
});

// @desc    Get all insurance logos (admin)
// @route   GET /api/insurance-logos/admin/all
// @access  Private/Admin
export const getAdminInsuranceLogos = catchAsync(async (req, res) => {
  await ensureDefaultInsuranceLogos();

  const logos = await InsuranceLogo.find().sort({
    displayOrder: 1,
    createdAt: 1,
  });

  res
    .status(200)
    .json(new ApiResponse(200, logos, "Insurance logos fetched successfully"));
});

// @desc    Create an insurance logo
// @route   POST /api/insurance-logos
// @access  Private/Admin
export const createInsuranceLogo = catchAsync(async (req, res) => {
  const maxOrder = await InsuranceLogo.findOne()
    .sort({ displayOrder: -1 })
    .select("displayOrder");

  const displayOrder =
    req.body.displayOrder ?? (maxOrder ? maxOrder.displayOrder + 1 : 0);

  const logo = await InsuranceLogo.create({
    ...req.body,
    displayOrder,
  });

  res
    .status(201)
    .json(new ApiResponse(201, logo, "Insurance logo created successfully"));
});

// @desc    Update an insurance logo
// @route   PUT /api/insurance-logos/:id
// @access  Private/Admin
export const updateInsuranceLogo = catchAsync(async (req, res) => {
  const logo = await InsuranceLogo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!logo) throw new ApiError(404, "Insurance logo not found");

  res
    .status(200)
    .json(new ApiResponse(200, logo, "Insurance logo updated successfully"));
});

// @desc    Delete an insurance logo
// @route   DELETE /api/insurance-logos/:id
// @access  Private/Admin
export const deleteInsuranceLogo = catchAsync(async (req, res) => {
  const logo = await InsuranceLogo.findByIdAndDelete(req.params.id);
  if (!logo) throw new ApiError(404, "Insurance logo not found");

  res
    .status(200)
    .json(new ApiResponse(200, logo, "Insurance logo deleted successfully"));
});
