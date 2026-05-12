// src/controllers/prescreen.controller.js
import PrescreenQuestion from "../models/PrescreenQuestion.js";
import Career from "../models/Career.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// ─── PUBLIC ──────────────────────────────────────────────────────────

// @desc    Get all prescreen questions attached to a specific job (for the application form)
// @route   GET /api/prescreen/job/:jobId
// @access  Public
export const getQuestionsForJob = catchAsync(async (req, res) => {
  const career = await Career.findOne({
    _id: req.params.jobId,
    isActive: true,
  }).populate({
    path: "prescreenQuestions",
    match: { isActive: true },
  });

  if (!career) {
    throw new ApiError(404, "Job posting not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, career.prescreenQuestions, "Questions fetched"));
});

// ─── ADMIN ───────────────────────────────────────────────────────────

// @desc    Get all questions in the global bank
// @route   GET /api/prescreen
// @access  Private (Admin)
export const getAllQuestions = catchAsync(async (req, res) => {
  const { category } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;

  const questions = await PrescreenQuestion.find(filter).sort({
    createdAt: -1,
  });

  res
    .status(200)
    .json(new ApiResponse(200, questions, "All prescreen questions fetched"));
});

// @desc    Create a new question in the bank
// @route   POST /api/prescreen
// @access  Private (Admin)
export const createQuestion = catchAsync(async (req, res) => {
  const { text, type, isRequired, category, yesNoOptions, selectOptions } =
    req.body;

  if (!text || !type) {
    throw new ApiError(400, "Question text and type are required");
  }

  const question = await PrescreenQuestion.create({
    text,
    type,
    isRequired: isRequired !== undefined ? isRequired : true,
    category: category || "General",
    yesNoOptions:
      type === "yes_no"
        ? yesNoOptions || [
            { label: "Yes", score: 10, isKnockout: false },
            { label: "No", score: 0, isKnockout: false },
          ]
        : [],
    selectOptions: type === "select" ? selectOptions || [] : [],
  });

  res
    .status(201)
    .json(new ApiResponse(201, question, "Question created successfully"));
});

// @desc    Update a question in the bank
// @route   PUT /api/prescreen/:id
// @access  Private (Admin)
export const updateQuestion = catchAsync(async (req, res) => {
  const question = await PrescreenQuestion.findById(req.params.id);
  if (!question) throw new ApiError(404, "Question not found");

  const allowed = [
    "text",
    "type",
    "isRequired",
    "category",
    "yesNoOptions",
    "selectOptions",
    "isActive",
  ];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) question[field] = req.body[field];
  });

  await question.save();

  res
    .status(200)
    .json(new ApiResponse(200, question, "Question updated successfully"));
});

// @desc    Soft-delete a question
// @route   DELETE /api/prescreen/:id
// @access  Private (Admin)
export const deleteQuestion = catchAsync(async (req, res) => {
  const question = await PrescreenQuestion.findById(req.params.id);
  if (!question) throw new ApiError(404, "Question not found");

  question.isActive = false;
  await question.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Question archived successfully"));
});

// @desc    Attach questions to a job posting (replace the whole set)
// @route   PUT /api/prescreen/job/:jobId/questions
// @access  Private (Admin)
export const setJobQuestions = catchAsync(async (req, res) => {
  const { questionIds } = req.body; // ordered array of PrescreenQuestion IDs

  if (!Array.isArray(questionIds)) {
    throw new ApiError(400, "questionIds must be an array");
  }

  if (questionIds.length > 5) {
    throw new ApiError(
      400,
      "A job posting can have a maximum of 5 prescreen questions",
    );
  }

  const career = await Career.findById(req.params.jobId);
  if (!career) throw new ApiError(404, "Job posting not found");

  career.prescreenQuestions = questionIds;
  await career.save();

  const populated = await Career.findById(req.params.jobId).populate(
    "prescreenQuestions",
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        populated.prescreenQuestions,
        "Questions updated for job posting",
      ),
    );
});

// ─── SEED ────────────────────────────────────────────────────────────

/**
 * @desc    Seed the global question bank with all questions from the CareerPlug screenshots
 * @route   POST /api/prescreen/seed
 * @access  Private (Admin) — run once, then disable or remove
 */
export const seedQuestions = catchAsync(async (req, res) => {
  // Prevent duplicate seeding
  const existing = await PrescreenQuestion.countDocuments();
  if (existing > 0) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          `Question bank already has ${existing} questions. Clear it first or skip seeding.`,
        ),
      );
  }

  const questions = [
    // ── Basic Requirements ──────────────────────────────────────────
    {
      text: "Are you legally authorized to work in the US?",
      type: "yes_no",
      isRequired: true,
      category: "Basic Requirements",
      yesNoOptions: [
        { label: "Yes", score: 10, isKnockout: false },
        { label: "No", score: 0, isKnockout: true }, // must be authorized
      ],
    },

    // ── Licensure ───────────────────────────────────────────────────
    {
      text: "Is your licensure LCAS?",
      type: "yes_no",
      isRequired: true,
      category: "Licensure",
      yesNoOptions: [
        { label: "Yes", score: 10, isKnockout: false },
        { label: "No", score: 1, isKnockout: false },
      ],
    },
    {
      text: "What licensure do you currently hold?",
      type: "open",
      isRequired: true,
      category: "Licensure",
    },

    // ── Experience ──────────────────────────────────────────────────
    {
      text: "Years of mental health experience",
      type: "open",
      isRequired: true,
      category: "Experience",
    },
    {
      text: "Years of Supervisory Experience",
      type: "open",
      isRequired: true,
      category: "Experience",
    },

    // ── Compensation ────────────────────────────────────────────────
    {
      text: "What are your salary expectations?",
      type: "open",
      isRequired: false,
      category: "Compensation",
    },
    {
      text: "What are your compensation expectations?",
      type: "open",
      isRequired: false,
      category: "Compensation",
    },

    // ── Availability ────────────────────────────────────────────────
    {
      text: "Are you available to work evenings or weekends if needed?",
      type: "yes_no",
      isRequired: false,
      category: "Availability",
      yesNoOptions: [
        { label: "Yes", score: 5, isKnockout: false },
        { label: "No", score: 0, isKnockout: false },
      ],
    },
    {
      text: "What is your earliest available start date?",
      type: "open",
      isRequired: false,
      category: "Availability",
    },

    // ── Practice Fit ────────────────────────────────────────────────
    {
      text: "Do you have experience working with substance abuse clients?",
      type: "yes_no",
      isRequired: false,
      category: "Practice Fit",
      yesNoOptions: [
        { label: "Yes", score: 8, isKnockout: false },
        { label: "No", score: 0, isKnockout: false },
      ],
    },
    {
      text: "Are you comfortable working with a telehealth platform?",
      type: "yes_no",
      isRequired: false,
      category: "Practice Fit",
      yesNoOptions: [
        { label: "Yes", score: 5, isKnockout: false },
        { label: "No", score: 0, isKnockout: false },
      ],
    },
    {
      text: "Do you have experience with IOP (Intensive Outpatient Programs)?",
      type: "yes_no",
      isRequired: false,
      category: "Practice Fit",
      yesNoOptions: [
        { label: "Yes", score: 8, isKnockout: false },
        { label: "No", score: 0, isKnockout: false },
      ],
    },
    {
      text: "What therapeutic modalities are you trained in?",
      type: "open",
      isRequired: false,
      category: "Practice Fit",
    },
    {
      text: "Why are you interested in working at Avighna Holistic Care?",
      type: "open",
      isRequired: false,
      category: "Practice Fit",
    },
  ];

  const created = await PrescreenQuestion.insertMany(questions);

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        created,
        `Successfully seeded ${created.length} prescreen questions`,
      ),
    );
});
