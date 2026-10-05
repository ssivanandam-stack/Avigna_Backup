import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const sanitizeUser = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  email: user.email,
  isActive: user.isActive !== false,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// @desc    List all admin users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAdminUsers = catchAsync(async (req, res) => {
  const users = await User.find().sort({ createdAt: 1 });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        users.map(sanitizeUser),
        "Admin users fetched successfully",
      ),
    );
});

// @desc    Create an admin user
// @route   POST /api/admin/users
// @access  Private/Admin
export const createAdminUser = catchAsync(async (req, res) => {
  const { name, email, password, isActive } = req.body;
  const normalizedEmail = String(email).trim().toLowerCase();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw new ApiError(409, "An admin with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    isActive: isActive !== false,
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, sanitizeUser(user), "Admin user created successfully"),
    );
});

// @desc    Update an admin user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateAdminUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "Admin user not found");

  const isSelf = String(user._id) === String(req.user._id);

  if (req.body.name !== undefined) {
    user.name = req.body.name.trim();
  }

  if (req.body.email !== undefined) {
    const normalizedEmail = String(req.body.email).trim().toLowerCase();
    if (normalizedEmail !== user.email) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing && String(existing._id) !== String(user._id)) {
        throw new ApiError(409, "An admin with this email already exists");
      }
      user.email = normalizedEmail;
    }
  }

  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 12);
  }

  if (req.body.isActive !== undefined) {
    if (isSelf && req.body.isActive === false) {
      throw new ApiError(400, "You cannot deactivate your own account");
    }
    user.isActive = Boolean(req.body.isActive);
  }

  await user.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, sanitizeUser(user), "Admin user updated successfully"),
    );
});

// @desc    Delete an admin user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteAdminUser = catchAsync(async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "Admin user not found");

  res
    .status(200)
    .json(
      new ApiResponse(200, sanitizeUser(user), "Admin user deleted successfully"),
    );
});
