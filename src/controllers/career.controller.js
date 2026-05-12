// src/controllers/career.controller.js
import Career from "../models/Career.js";
import Application from "../models/Application.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// ─── PUBLIC ──────────────────────────────────────────────────────────

// @desc    Get all active careers (public listing)
// @route   GET /api/careers
// @access  Public
export const getCareers = catchAsync(async (req, res) => {
  const { department } = req.query;

  const filter = { isActive: true };
  if (department && department !== "All") {
    filter.department = department;
  }

  const careers = await Career.find(filter)
    .sort({ createdAt: -1 })
    .populate("applicantCount");

  res
    .status(200)
    .json(new ApiResponse(200, careers, "Careers fetched successfully"));
});

// @desc    Get a single career by ID (public detail page)
// @route   GET /api/careers/:id
// @access  Public
export const getCareerById = catchAsync(async (req, res) => {
  const career = await Career.findOne({
    _id: req.params.id,
    isActive: true,
  })
    .populate("applicantCount")
    .populate("prescreenQuestions"); // ← populate so frontend gets full question objects

  if (!career) {
    throw new ApiError(404, "Job posting not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, career, "Career fetched successfully"));
});

// ─── ADMIN ───────────────────────────────────────────────────────────

// @desc    Get all careers (admin — includes inactive + applicant counts)
// @route   GET /api/careers/admin/all
// @access  Private (Admin)
export const getAdminCareers = catchAsync(async (req, res) => {
  const careers = await Career.find()
    .sort({ createdAt: -1 })
    .populate("applicantCount")
    .populate("prescreenQuestions"); // ← so the edit modal pre-fills correctly

  res.status(200).json(new ApiResponse(200, careers, "All careers fetched"));
});

// @desc    Create a new job posting
// @route   POST /api/careers
// @access  Private (Admin)
export const createCareer = catchAsync(async (req, res) => {
  const {
    title,
    type,
    location,
    department,
    description,
    responsibilities,
    qualifications,
    benefits,
    salaryMin,
    salaryMax,
    salaryType,
    applicationDeadline,
    accentColor,
    prescreenQuestions,
  } = req.body;

  if (!title || !type || !location || !department || !description) {
    throw new ApiError(
      400,
      "Title, type, location, department, and description are required",
    );
  }

  const career = await Career.create({
    title,
    type,
    location,
    department,
    description,
    responsibilities: responsibilities || [],
    qualifications: qualifications || [],
    benefits: benefits || [],
    salaryMin: salaryMin || null,
    salaryMax: salaryMax || null,
    salaryType: salaryType || "yearly",
    applicationDeadline: applicationDeadline || null,
    accentColor: accentColor || "#14b8a6",
    prescreenQuestions: prescreenQuestions || [], // ← include on create
  });

  res
    .status(201)
    .json(new ApiResponse(201, career, "Job posting created successfully"));
});

// @desc    Update an existing job posting
// @route   PUT /api/careers/:id
// @access  Private (Admin)
export const updateCareer = catchAsync(async (req, res) => {
  const career = await Career.findById(req.params.id);

  if (!career) {
    throw new ApiError(404, "Job posting not found");
  }

  const allowedFields = [
    "title",
    "type",
    "location",
    "department",
    "description",
    "responsibilities",
    "qualifications",
    "benefits",
    "salaryMin",
    "salaryMax",
    "salaryType",
    "applicationDeadline",
    "accentColor",
    "isActive",
    "prescreenQuestions", // ← THIS WAS THE BUG — now included
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      career[field] = req.body[field];
    }
  });

  await career.save();

  // Return populated so the frontend modal refreshes correctly
  const updated = await Career.findById(career._id).populate(
    "prescreenQuestions",
  );

  res
    .status(200)
    .json(new ApiResponse(200, updated, "Job posting updated successfully"));
});

// @desc    Soft-delete a job posting (set isActive to false)
// @route   DELETE /api/careers/:id
// @access  Private (Admin)
export const deleteCareer = catchAsync(async (req, res) => {
  const career = await Career.findById(req.params.id);

  if (!career) {
    throw new ApiError(404, "Job posting not found");
  }

  career.isActive = false;
  await career.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Job posting deactivated successfully"));
});

// @desc    Get unique departments for filtering
// @route   GET /api/careers/departments
// @access  Public
export const getDepartments = catchAsync(async (req, res) => {
  const departments = await Career.distinct("department", { isActive: true });
  res
    .status(200)
    .json(new ApiResponse(200, departments, "Departments fetched"));
});
