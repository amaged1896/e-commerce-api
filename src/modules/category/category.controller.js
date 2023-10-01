import { AppError } from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import cloudinary from './../../utils/cloud.js';
import { categoryModel } from './../../../DB/model/category.model.js';
import slugify from "slugify";

export const createCategory = catchAsync(async (req, res, next) => {
    if (!req.file) return next(new AppError("Category image is required!"));

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.FOLDER_CLOUD_NAME}/category` });
    // save category in database
    const category = await categoryModel.create({
        name: req.body.name,
        createdBy: req.user._id,
        image: { id: public_id, url: secure_url },
        slug: slugify(req.body.name)
    });
    return res.status(201).json({ status: "success", message: "Category created successfully!", results: category });
});


export const updateCategory = catchAsync(async (req, res, next) => {
    // check category 
    const category = await categoryModel.findById(req.params.categoryId);
    if (!category) return next(new AppError("Category not found!", 200));
    // name
    category.name = req.body.name ? req.body.name : category.name;
    // slug
    category.slug = req.body.name ? slugify(req.body.name) : category.slug;

    // files
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { public_id: category.image.id });
        category.image.url = secure_url;
    }

    // save category
    await category.save();
    return res.status(200).json({ status: "success", message: "Category has been updated successfully", results: category });
});


export const deleteCategory = catchAsync(async (req, res, next) => {
    // check category 
    const category = await categoryModel.findById(req.params.categoryId);
    if (!category) return next(new AppError("Category not found!", 200));

    // delete image 
    const result = await cloudinary.uploader.destroy(category.image.id);
    console.log(result);

    // delete category
    await categoryModel.findByIdAndDelete(req.params.categoryId);
    return res.status(200).json({ status: "success", message: "Category has been deleted successfully!" });
});


export const getCategories = catchAsync(async (req, res, next) => {
    // check category 
    const categories = await categoryModel.find().populate([
        {
            path: "createdBy",
            select: "_id userName email status role verified"
        }
    ]);
    if (!categories) return next(new AppError("There are no categories!", 404));

    return res.status(200).json({ status: "success", results: categories });
});