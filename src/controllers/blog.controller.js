import Blog from "../models/Blog.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileToS3, getFileObject } from "../services/s3.service.js";

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = catchAsync(async (req, res) => {
  const { title, excerpt, content, category, coverImageUrl, tags } = req.body;

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const blog = await Blog.create({
    title,
    slug,
    excerpt,
    content,
    category,
    coverImageUrl,
    tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
  });

  res.status(201).json({
    status: "success",
    message: "Blog published successfully",
    data: blog,
  });
});

// @desc    Get all blogs (with optional category filtering)
// @route   GET /api/blogs
// @access  Public
export const getBlogs = catchAsync(async (req, res) => {
  const { category } = req.query;
  const filter = category && category !== "All blogs" ? { category } : {};
  const blogs = await Blog.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: blogs.length,
    data: blogs,
  });
});

// @desc    Serve an uploaded blog image by streaming it from S3
// @route   GET /api/blogs/image?key=blogs/...
// @access  Public
export const getBlogImage = catchAsync(async (req, res) => {
  const { key } = req.query;

  if (!key || typeof key !== "string" || !key.startsWith("blogs/")) {
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

// @desc    Upload a blog image (cover or inline editor image)
// @route   POST /api/blogs/upload-image
// @access  Private/Admin
export const uploadBlogImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image file provided");
  }

  const { url, key } = await uploadFileToS3(req.file, "blogs");

  res
    .status(201)
    .json(new ApiResponse(201, { url, key }, "Image uploaded successfully"));
});

// @desc    Get a single blog by its URL slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = catchAsync(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });

  if (!blog) {
    return res
      .status(404)
      .json({ status: "error", message: "Article not found" });
  }

  res.status(200).json({ status: "success", data: blog });
});

// @desc    Update a blog post
// @route   PUT /api/blogs/:slug
// @access  Private/Admin
export const updateBlog = catchAsync(async (req, res) => {
  const { title, excerpt, content, category, coverImageUrl, tags, isFeatured } =
    req.body;

  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) throw new ApiError(404, "Blog not found");

  // If title changed, regenerate slug
  if (title && title !== blog.title) {
    blog.slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    blog.title = title;
  }

  if (excerpt !== undefined) blog.excerpt = excerpt;
  if (content !== undefined) blog.content = content;
  if (category !== undefined) blog.category = category;
  if (coverImageUrl !== undefined) blog.coverImageUrl = coverImageUrl;
  if (isFeatured !== undefined) blog.isFeatured = isFeatured;
  if (tags !== undefined)
    blog.tags =
      typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags;

  await blog.save();

  res
    .status(200)
    .json({ status: "success", message: "Blog updated", data: blog });
});

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:slug
// @access  Private/Admin
export const deleteBlog = catchAsync(async (req, res) => {
  const blog = await Blog.findOneAndDelete({ slug: req.params.slug });
  if (!blog) throw new ApiError(404, "Blog not found");

  res
    .status(200)
    .json({ status: "success", message: "Blog deleted successfully" });
});
