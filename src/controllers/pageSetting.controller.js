import PageSetting from "../models/PageSetting.js";
import { catchAsync } from "../utils/catchAsync.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const DEFAULTS = {
  services: {
    heroImage: "/image/image3.webp",
  },
};

const getOrCreate = async (key) => {
  const defaults = DEFAULTS[key] || { heroImage: "" };
  let setting = await PageSetting.findOne({ key });
  if (!setting) {
    setting = await PageSetting.create({ key, ...defaults });
  }
  return setting;
};

// @desc    Get public page settings
// @route   GET /api/page-settings/:key
// @access  Public
export const getPageSetting = catchAsync(async (req, res) => {
  const key = String(req.params.key || "").trim().toLowerCase();
  const setting = await getOrCreate(key);

  res
    .status(200)
    .json(new ApiResponse(200, setting, "Page settings fetched successfully"));
});

// @desc    Update page settings
// @route   PUT /api/page-settings/:key
// @access  Private/Admin
export const updatePageSetting = catchAsync(async (req, res) => {
  const key = String(req.params.key || "").trim().toLowerCase();
  const setting = await getOrCreate(key);

  if (req.body.heroImage !== undefined) {
    setting.heroImage = String(req.body.heroImage).trim();
  }

  await setting.save();

  res
    .status(200)
    .json(new ApiResponse(200, setting, "Page settings updated successfully"));
});
