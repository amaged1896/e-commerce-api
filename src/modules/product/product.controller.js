import { nanoid } from "nanoid";
import { AppError } from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import cloudinary from './../../utils/cloud.js';
import { sendData } from './../../utils/sendData.js';
import { ProductModel } from "../../../DB/model/product.model.js";
import { CategoryModel } from './../../../DB/model/category.model.js';
import { SubcategoryModel } from './../../../DB/model/subcategory.model.js';
import { BrandModel } from './../../../DB/model/brand.model.js';
import APIFeatures from "../../utils/apiFeatures.js";

export const addProduct = catchAsync(async (req, res, next) => {
    // check category 
    const category = await CategoryModel.findById(req.body.category);
    if (!category) return next(new AppError("category not found!", 404));

    // check subcategory 
    const subcategory = await SubcategoryModel.findById(req.body.subcategory);
    if (!subcategory) return next(new AppError("subcategory not found!", 404));

    // check brand 
    const brand = await BrandModel.findById(req.body.brand);
    if (!brand) return next(new AppError("brand not found!", 404));

    // check product exists
    const isExist = await ProductModel.findOne({ name: req.body.name });
    if (isExist) return next(new AppError("product already exists!", 400));
    // files ? 
    if (!req.files) return next(new AppError("Product Images are required!", 400));

    // create unique folder name
    const cloudFolder = nanoid();
    let images = [];
    // upload files 
    for (const file of req.files.subImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
            { folder: `${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}` });
        images.push({ id: public_id, url: secure_url });
    }

    // upload default image
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.defaultImage[0].path,
        { folder: `${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}` });

    // create product
    const product = await ProductModel.create({
        ...req.body,
        cloudFolder,
        createdBy: req.user._id,
        defaultImage: { id: public_id, url: secure_url },
        images
    });
    sendData(201, "success", "Product created successfully", product, res);
});

export const updateProduct = catchAsync(async (req, res, next) => {

});

export const deleteProduct = catchAsync(async (req, res, next) => {
    // check product
    const product = await ProductModel.findById(req.params.productId);
    if (!product) return next(new AppError("Product not found", 400));

    // check owner
    if (req.user._id.toString() != product.createdBy.toString()) return next(new AppError("Not authorized", 401));
    // delete product and images

    const imagesArray = product.images;

    const ids = imagesArray.map((imageObject) => imageObject.id);
    console.log(ids);
    ids.push(product.defaultImage.id); // add id of default image

    const result = await cloudinary.api.delete_resources(ids);
    console.log(result);
    // delete image folder
    await cloudinary.api.delete_folder(`${process.env.FOLDER_CLOUD_NAME}/products/${product.cloudFolder}`);

    // delete product from database
    await ProductModel.findByIdAndDelete(req.params.productId);

    // response
    sendData(200, "success", "product successfully deleted", undefined, res);
});

export const getAllProducts = catchAsync(async (req, res, next) => {
    const apiFeatures = new APIFeatures(ProductModel.find({}), req.query)
        .paginate()
        .filter()
        .sort()
        .limitFields()
        .search();
    let products = await apiFeatures.query;

    if (!products.length) return next(new AppError("There are no products", 400));
    sendData(200, "success", undefined, products, res);
});


export const getCategoryProducts = catchAsync(async (req, res, next) => {
    const products = await ProductModel.find({ category: req.params.categoryId });
    if (!products) return next(new AppError("There are no products for that category", 400));
    sendData(200, "success", undefined, products, res);
});

export const getSingleProduct = catchAsync(async (req, res, next) => {
    const product = await ProductModel.findById(req.params.productId);
    if (!product) return next(new AppError("product not found", 404));
    sendData(200, "success", undefined, product, res);
});