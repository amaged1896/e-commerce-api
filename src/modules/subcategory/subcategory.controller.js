import slugify from "slugify";
import { SubcategoryModel } from "../../../DB/model/subcategory.model.js";
import { AppError } from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import cloudinary from "../../utils/cloud.js";
import { CategoryModel } from './../../../DB/model/category.model.js';
import { sendData } from "../../utils/sendData.js";

export const createSubCategory = catchAsync(async (req, res, next) => {
    const { categoryId } = req.params;
    const isExist = await SubcategoryModel.findOne({ name: req.body.name });
    if (isExist) return next(new AppError("Subcategory already exists", 400));
    // check file
    if (!req.file) return next(new AppError("Image is required!", 404));

    // check category
    const category = await CategoryModel.findById(categoryId);
    if (!category) return next(new AppError("Category not found!", 404));

    // upload file
    const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.FOLDER_CLOUD_NAME}/subcategory` });

    // save in database
    const subcategory = await SubcategoryModel.create({
        name: req.body.name,
        slug: slugify(req.body.name),
        createdBy: req.user._id,
        image: { id: public_id, url: secure_url },
        categoryId
    });

    sendData(201, "success", "Subcategory created successfully!", subcategory, res);
});

export const updateSubCategory = catchAsync(async (req, res, next) => {
    // check category
    const category = await CategoryModel.findById(req.params.categoryId);
    if (!category) return next(new AppError("Category not found!", 404));

    // check subcategory
    const subcategory = await SubcategoryModel.findOne({ _id: req.params.subcategoryId, categoryId: req.params.categoryId });
    if (!subcategory) return next(new AppError("Subcategory not found!", 404));

    // check owner
    if (req.user._id.toString() !== subcategory.createdBy.toString()) {
        return next(new AppError("You are not authorized for that action!", 404));
    }

    // update 
    subcategory.name = req.body.name ? req.body.name : subcategory.name;
    subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug;

    // file ? 
    if (req.file) {
        const { secure_url } = await cloudinary.uploader.upload(req.file.path, { public_id: subcategory.image.id });
        subcategory.image.url = secure_url;
    }
    await subcategory.save();

    sendData(200, "success", "Subcategory has been updated successfully!", subcategory, res);
});

export const deleteSubCategory = catchAsync(async (req, res, next) => {
    // check category
    const category = await CategoryModel.findById(req.params.categoryId);
    if (!category) return next(new AppError("Category not found!", 404));

    // check subcategory and delete 
    const subcategory = await SubcategoryModel.findOneAndDelete({ _id: req.params.subcategoryId, categoryId: req.params.categoryId });
    if (!subcategory) return next(new AppError("Subcategory not found!", 404));

    // check owner
    if (req.user._id.toString() !== subcategory.createdBy.toString()) {
        return next(new AppError("You are not authorized for that action!", 404));
    }
    sendData(200, "success", "Subcategory has been deleted successfully!", undefined, res);
});

export const getAllSubCategory = catchAsync(async (req, res, next) => {
    const subCategories = await SubcategoryModel.find().populate([
        {
            path: "categoryId",
            select: "name",
        },
        {
            path: "createdBy",
            select: "-password -__v -verified",
        }
    ]);
    if (!subCategories) return next(new AppError("Subcategory not found!", 404));
    sendData(200, "success", undefined, subCategories, res);
});
