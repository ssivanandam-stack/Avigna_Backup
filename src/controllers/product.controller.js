import Product from "../models/Product.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";

// @desc    Get all recommended products
// @route   GET /api/products
// @access  Public
export const getProducts = catchAsync(async (req, res) => {
  const { category } = req.query;
  const filter = category && category !== "All" ? { category } : {};
  const products = await Product.find(filter).sort({ createdAt: -1 });

  res
    .status(200)
    .json({ status: "success", results: products.length, data: products });
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = catchAsync(async (req, res) => {
  const { name, category, price, description, imageUrl, accentColor } =
    req.body;

  const product = await Product.create({
    name,
    category,
    price,
    description,
    imageUrl,
    accentColor: accentColor || "#ff5c00",
  });

  res
    .status(201)
    .json({
      status: "success",
      message: "Product added successfully",
      data: product,
    });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) throw new ApiError(404, "Product not found");

  res
    .status(200)
    .json({ status: "success", message: "Product updated", data: product });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  res
    .status(200)
    .json({ status: "success", message: "Product deleted successfully" });
});
