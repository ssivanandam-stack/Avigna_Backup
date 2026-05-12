import Blog from "../models/Blog.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";

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
