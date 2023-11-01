import slugify from "slugify";
import { catchAsync } from "../../utils/catchAsync.js";
import { BrandModel } from './../../../DB/model/brand.model.js';
import { sendData } from './../../utils/sendData.js';
import cloudinary from './../../utils/cloud.js';
import { AppError } from "../../utils/appError.js";


export const createBrand = catchAsync(async (req, res, next) => {
    if (!req.file) return next(new AppError("brand image is required!"));
    const isExist = await BrandModel.findOne({ name: req.body.name });
    if (isExist) return next(new AppError("brand already exists!", 400));

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.FOLDER_CLOUD_NAME}/brand` });
    // save brand in database
    const brand = await BrandModel.create({
        name: req.body.name,
        createdBy: req.user._id,
        image: { id: public_id, url: secure_url },
        slug: slugify(req.body.name)
    });
    sendData(201, "success", "brand created successfully!", brand, res);
});


export const updateBrand = catchAsync(async (req, res, next) => {
    // check brand 
    const brand = await BrandModel.findById(req.params.brandId);
    if (!brand) return next(new AppError("brand not found!", 200));

    // check owner
    if (req.user._id.toString() !== brand.createdBy.toString()) {
        return next(new AppError("You are not authorized for that action!", 404));
    }

    // update
    brand.name = req.body.name ? req.body.name : brand.name;
    brand.slug = req.body.name ? slugify(req.body.name) : brand.slug;

    // files
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { public_id: brand.image.id });
        brand.image.url = secure_url;
    }

    // save brand
    await brand.save();
    sendData(200, "success", "brand has been updated successfully!", brand, res);
});

export const deleteBrand = catchAsync(async (req, res, next) => {
    // check brand 
    const brand = await BrandModel.findById(req.params.brandId);
    if (!brand) return next(new AppError("brand not found!", 200));

    // check owner
    if (req.user._id.toString() !== brand.createdBy.toString()) {
        return next(new AppError("You are not authorized for that action!", 404));
    }

    // delete image 
    const result = await cloudinary.uploader.destroy(brand.image.id);
    console.log(result);

    // delete brand
    await BrandModel.findByIdAndDelete(req.params.brandId);
    sendData(200, "success", "brand has been deleted successfully!", undefined, res);
});

export const getAllBrands = catchAsync(async (req, res, next) => {
    // check brand 
    const brands = await BrandModel.find();
    if (!brands) return next(new AppError("There are no brands!", 404));
    sendData(200, "success", undefined, brands, res);
}); 