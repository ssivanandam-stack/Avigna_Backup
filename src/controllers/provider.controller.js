import { catchAsync } from "../utils/catchAsync.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as providerService from "../services/provider.service.js";

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
