// src/controllers/application.controller.js
import Application from "../models/Application.js";
import Career from "../models/Career.js";
import PrescreenQuestion from "../models/PrescreenQuestion.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadFileToS3, getFileSignedUrl } from "../services/s3.service.js";
import {
  sendApplicationReceived,
  sendAdminNewApplication,
  sendStatusReviewing,
  sendStatusInterviewing,
  sendStatusAccepted,
  sendStatusRejected,
} from "../services/career-email.service.js";

// ─── PUBLIC ──────────────────────────────────────────────────────────

// @desc    Submit a job application (with resume upload to S3)
// @route   POST /api/applications/:jobId
// @access  Public
export const submitApplication = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  const { firstName, lastName, email, phone, coverLetter, prescreenAnswers } =
    req.body;

  // 1. Validate job exists and is active, populate its prescreen questions
  const job = await Career.findOne({ _id: jobId, isActive: true }).populate({
    path: "prescreenQuestions",
    match: { isActive: true },
  });
  if (!job) {
    throw new ApiError(404, "This job posting is no longer available");
  }

  // 2. Check for deadline
  if (
    job.applicationDeadline &&
    new Date(job.applicationDeadline) < new Date()
  ) {
    throw new ApiError(
      400,
      "The application deadline for this position has passed",
    );
  }

  // 3. Check for duplicate application (same email + same job)
  const existingApplication = await Application.findOne({
    job: jobId,
    email: email.toLowerCase(),
  });
  if (existingApplication) {
    throw new ApiError(409, "You have already applied for this position");
  }

  // 4. Validate resume file
  if (!req.file) {
    throw new ApiError(400, "Resume file is required");
  }
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!allowedTypes.includes(req.file.mimetype)) {
    throw new ApiError(
      400,
      "Resume must be a PDF or Word document (.pdf, .doc, .docx)",
    );
  }

  // 5. Upload resume to S3
  const { url: resumeUrl, key: resumeS3Key } = await uploadFileToS3(
    req.file,
    "resumes",
  );

  // 6. Calculate resume expiry (30 days from now)
  const resumeExpiresAt = new Date();
  resumeExpiresAt.setDate(resumeExpiresAt.getDate() + 30);

  // 7. Process prescreen answers
  //    prescreenAnswers from the request body is expected to be a JSON string or array:
  //    [{ questionId: "...", answer: "Yes" }, ...]
  let parsedAnswers = [];
  if (prescreenAnswers) {
    try {
      parsedAnswers =
        typeof prescreenAnswers === "string"
          ? JSON.parse(prescreenAnswers)
          : prescreenAnswers;
    } catch {
      parsedAnswers = [];
    }
  }

  let totalScore = 0;
  let hasKnockout = false;
  const processedAnswers = [];

  for (const q of job.prescreenQuestions) {
    const submitted = parsedAnswers.find(
      (a) => a.questionId === q._id.toString(),
    );
    const answerText = submitted?.answer?.trim() || "";

    let score = 0;
    let isKnockout = false;

    if (q.type === "yes_no") {
      const match = q.yesNoOptions.find(
        (opt) => opt.label.toLowerCase() === answerText.toLowerCase(),
      );
      if (match) {
        score = match.score || 0;
        isKnockout = match.isKnockout || false;
      }
    }
    // For "open" and "select" types we store as-is; score defaults to 0

    totalScore += score;
    if (isKnockout) hasKnockout = true;

    processedAnswers.push({
      question: q._id,
      questionText: q.text,
      answer: answerText,
      score,
      isKnockout,
    });
  }

  // 8. Create the application
  const application = await Application.create({
    job: jobId,
    firstName,
    lastName,
    email: email.toLowerCase(),
    phone: phone || "",
    coverLetter: coverLetter || "",
    resumeUrl,
    resumeS3Key,
    resumeExpiresAt,
    prescreenAnswers: processedAnswers,
    prescreenScore: totalScore,
    prescreenKnockout: hasKnockout,
  });

  // 9. Send emails (non-blocking)
  const applicantName = `${firstName} ${lastName}`;
  Promise.allSettled([
    sendApplicationReceived({ to: email, applicantName, jobTitle: job.title }),
    sendAdminNewApplication({
      applicantName,
      applicantEmail: email,
      jobTitle: job.title,
      jobId: job._id,
      applicationId: application._id,
    }),
  ]).then((results) => {
    results.forEach((result, i) => {
      if (result.status === "rejected") {
        console.error(`Career email ${i} failed:`, result.reason?.message);
      }
    });
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        applicationId: application._id,
        status: application.status,
        prescreenScore: totalScore,
        prescreenKnockout: hasKnockout,
      },
      "Application submitted successfully",
    ),
  );
});

// ─── ADMIN ───────────────────────────────────────────────────────────

// @desc    Get all applications (optionally filtered by job / status)
// @route   GET /api/applications
// @access  Private (Admin)
export const getAllApplications = catchAsync(async (req, res) => {
  const { jobId, status } = req.query;

  const filter = {};
  if (jobId) filter.job = jobId;
  if (status) filter.status = status;

  const applications = await Application.find(filter)
    .populate("job", "title department accentColor")
    .sort({ prescreenScore: -1, createdAt: -1 }); // best scores first

  res
    .status(200)
    .json(new ApiResponse(200, applications, "Applications fetched"));
});

// @desc    Get applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Admin)
export const getApplicationsByJob = catchAsync(async (req, res) => {
  const applications = await Application.find({ job: req.params.jobId }).sort({
    prescreenScore: -1,
    createdAt: -1,
  });

  res
    .status(200)
    .json(new ApiResponse(200, applications, "Applications fetched"));
});

// @desc    Get a single application by ID (with signed resume URL)
// @route   GET /api/applications/:id
// @access  Private (Admin)
export const getApplicationById = catchAsync(async (req, res) => {
  const application = await Application.findById(req.params.id).populate(
    "job",
    "title department accentColor prescreenQuestions",
  );

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  let resumeSignedUrl = null;
  if (!application.resumeDeleted && application.resumeS3Key) {
    try {
      resumeSignedUrl = await getFileSignedUrl(application.resumeS3Key);
    } catch {
      resumeSignedUrl = null;
    }
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...application.toObject(), resumeSignedUrl },
        "Application fetched",
      ),
    );
});

// @desc    Update application status (and trigger status email)
// @route   PATCH /api/applications/:id/status
// @access  Private (Admin)
export const updateApplicationStatus = catchAsync(async (req, res) => {
  const { status, note, interviewDate, interviewLink } = req.body;

  const application = await Application.findById(req.params.id).populate(
    "job",
    "title",
  );
  if (!application) throw new ApiError(404, "Application not found");

  const validStatuses = [
    "applied",
    "reviewing",
    "interviewing",
    "accepted",
    "rejected",
  ];
  if (!validStatuses.includes(status)) {
    throw new ApiError(
      400,
      `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
    );
  }

  application.status = status;
  application.statusHistory.push({
    status,
    note: note || "",
    changedAt: new Date(),
  });

  if (status === "interviewing") {
    if (interviewDate) application.interviewDate = new Date(interviewDate);
    if (interviewLink) application.interviewLink = interviewLink;
  }

  await application.save();

  // Send status email (non-blocking)
  const applicantName = `${application.firstName} ${application.lastName}`;
  const emailPayload = {
    to: application.email,
    applicantName,
    jobTitle: application.job?.title || "the position",
  };

  const emailMap = {
    reviewing: () => sendStatusReviewing(emailPayload),
    interviewing: () =>
      sendStatusInterviewing({ ...emailPayload, interviewDate, interviewLink }),
    accepted: () => sendStatusAccepted(emailPayload),
    rejected: () => sendStatusRejected(emailPayload),
  };

  if (emailMap[status]) {
    emailMap[status]().catch((err) =>
      console.error(`Status email failed for ${status}:`, err.message),
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, application, "Application status updated"));
});

// @desc    Update admin notes on an application
// @route   PATCH /api/applications/:id/notes
// @access  Private (Admin)
export const updateApplicationNotes = catchAsync(async (req, res) => {
  const { adminNotes } = req.body;

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    { adminNotes },
    { new: true },
  );

  if (!application) throw new ApiError(404, "Application not found");

  res.status(200).json(new ApiResponse(200, application, "Notes updated"));
});

// @desc    Get application stats (for admin dashboard widgets)
// @route   GET /api/applications/stats
// @access  Private (Admin)
export const getApplicationStats = catchAsync(async (req, res) => {
  const [total, byStatus, knockouts] = await Promise.all([
    Application.countDocuments(),
    Application.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Application.countDocuments({ prescreenKnockout: true }),
  ]);

  const statusMap = {};
  byStatus.forEach(({ _id, count }) => {
    statusMap[_id] = count;
  });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        byStatus: statusMap,
        knockouts,
      },
      "Stats fetched",
    ),
  );
});
