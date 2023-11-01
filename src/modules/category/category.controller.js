import { AppError } from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import cloudinary from './../../utils/cloud.js';
import { CategoryModel } from './../../../DB/model/category.model.js';
import slugify from "slugify";
import { sendData } from "../../utils/sendData.js";
import { SubcategoryModel } from './../../../DB/model/subcategory.model.js';

export const createCategory = catchAsync(async (req, res, next) => {
    console.log("I'm INTO category controller");
    if (!req.file) return next(new AppError("Category image is required!"));

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.FOLDER_CLOUD_NAME}/category` });
    // save category in database
    const category = await CategoryModel.create({
        name: req.body.name,
        createdBy: req.user._id,
        image: { id: public_id, url: secure_url },
        slug: slugify(req.body.name)
    });
    sendData(201, "success", "Category created successfully!", category, res);
});


export const updateCategory = catchAsync(async (req, res, next) => {
    // check category 
    const category = await CategoryModel.findById(req.params.categoryId);
    if (!category) return next(new AppError("Category not found!", 200));

    // check owner
    if (req.user._id.toString() !== category.createdBy.toString()) {
        return next(new AppError("You are not authorized for that action!", 404));
    }

    // update
    category.name = req.body.name ? req.body.name : category.name;
    category.slug = req.body.name ? slugify(req.body.name) : category.slug;

    // files
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { public_id: category.image.id });
        category.image.url = secure_url;
    }

    // save category
    await category.save();
    sendData(200, "success", "Category has been updated successfully!", category, res);
});


export const deleteCategory = catchAsync(async (req, res, next) => {
    // check category 
    const category = await CategoryModel.findById(req.params.categoryId);
    if (!category) return next(new AppError("Category not found!", 200));

    // check owner
    if (req.user._id.toString() !== subcategory.createdBy.toString()) {
        return next(new AppError("You are not authorized for that action!", 404));
    }

    // delete image 
    const result = await cloudinary.uploader.destroy(category.image.id);
    console.log(result);

    // delete category
    await CategoryModel.findByIdAndDelete(req.params.categoryId);

    // delete subcategories
    await SubcategoryModel.deleteMany({ categoryId: req.params.categoryId });
    sendData(200, "success", "Category has been deleted successfully!", undefined, res);
});


export const getAllCategories = catchAsync(async (req, res, next) => {
    // check category 
    const categories = await CategoryModel.find().populate([
        {
            path: "subcategory",
            select: "_id name slug image",
            // nested populate
            populate: [{ path: "createdBy" }]
        }
    ]);
    if (!categories) return next(new AppError("There are no categories!", 404));
    sendData(200, "success", undefined, categories, res);
});