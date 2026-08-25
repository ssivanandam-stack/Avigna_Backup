import EmployeeLink from "../models/EmployeeLink.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// @desc    Get active employee links (public footer)
// @route   GET /api/employee-links
// @access  Public
export const getEmployeeLinks = catchAsync(async (req, res) => {
  const links = await EmployeeLink.find({ isActive: true }).sort({
    displayOrder: 1,
    createdAt: 1,
  });

  res
    .status(200)
    .json(new ApiResponse(200, links, "Employee links fetched successfully"));
});

// @desc    Get all employee links (admin)
// @route   GET /api/employee-links/admin/all
// @access  Private/Admin
export const getAdminEmployeeLinks = catchAsync(async (req, res) => {
  const links = await EmployeeLink.find().sort({
    displayOrder: 1,
    createdAt: 1,
  });

  res
    .status(200)
    .json(new ApiResponse(200, links, "Employee links fetched successfully"));
});

// @desc    Create an employee link
// @route   POST /api/employee-links
// @access  Private/Admin
export const createEmployeeLink = catchAsync(async (req, res) => {
  const maxOrder = await EmployeeLink.findOne()
    .sort({ displayOrder: -1 })
    .select("displayOrder");

  const displayOrder =
    req.body.displayOrder ?? (maxOrder ? maxOrder.displayOrder + 1 : 0);

  const link = await EmployeeLink.create({
    ...req.body,
    displayOrder,
  });

  res
    .status(201)
    .json(new ApiResponse(201, link, "Employee link created successfully"));
});

// @desc    Update an employee link
// @route   PUT /api/employee-links/:id
// @access  Private/Admin
export const updateEmployeeLink = catchAsync(async (req, res) => {
  const link = await EmployeeLink.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!link) throw new ApiError(404, "Employee link not found");

  res
    .status(200)
    .json(new ApiResponse(200, link, "Employee link updated successfully"));
});

// @desc    Delete an employee link
// @route   DELETE /api/employee-links/:id
// @access  Private/Admin
export const deleteEmployeeLink = catchAsync(async (req, res) => {
  const link = await EmployeeLink.findByIdAndDelete(req.params.id);
  if (!link) throw new ApiError(404, "Employee link not found");

  res
    .status(200)
    .json(new ApiResponse(200, link, "Employee link deleted successfully"));
});
