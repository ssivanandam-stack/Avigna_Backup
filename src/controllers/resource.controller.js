import Resource from "../models/Resource.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
export const getResources = catchAsync(async (req, res) => {
  const resources = await Resource.find().sort({ createdAt: -1 });

  res
    .status(200)
    .json({ status: "success", results: resources.length, data: resources });
});

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private/Admin
export const createResource = catchAsync(async (req, res) => {
  const { title, type, description, fileUrl, accentColor } = req.body;

  const resource = await Resource.create({
    title,
    type,
    description,
    fileUrl,
    accentColor: accentColor || "#14b8a6",
  });

  res
    .status(201)
    .json({
      status: "success",
      message: "Resource added successfully",
      data: resource,
    });
});

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Private/Admin
export const updateResource = catchAsync(async (req, res) => {
  const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!resource) throw new ApiError(404, "Resource not found");

  res
    .status(200)
    .json({ status: "success", message: "Resource updated", data: resource });
});

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private/Admin
export const deleteResource = catchAsync(async (req, res) => {
  const resource = await Resource.findByIdAndDelete(req.params.id);
  if (!resource) throw new ApiError(404, "Resource not found");

  res
    .status(200)
    .json({ status: "success", message: "Resource deleted successfully" });
});
