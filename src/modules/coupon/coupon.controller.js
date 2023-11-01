import { catchAsync } from "../../utils/catchAsync.js";
import voucher_codes from "voucher-code-generator";
import { CouponModel } from './../../../DB/model/coupon.model.js';
import { sendData } from './../../utils/sendData.js';
import { AppError } from "../../utils/appError.js";

export const createCoupon = catchAsync(async (req, res, next) => {
    console.log("Hello World");
    // generate code
    const code = voucher_codes.generate({ length: 5 }); // return Array => []

    // create coupon
    const coupon = await CouponModel.create({
        code: code[0],
        discount: req.body.discount,
        expiredAt: new Date(req.body.expiredAt).getTime(), // 8/10/2023
        createdBy: req.user._id
    });
    sendData(201, "success", "coupon created successfully", coupon, res);
});

export const getAllCoupons = catchAsync(async (req, res, next) => {
    const coupons = await CouponModel.find();
    if (!coupons) return next(new AppError("There are no Coupons", 400));
    sendData(201, "success", undefined, coupons, res);
});

export const updateCoupon = catchAsync(async (req, res, next) => {
    const coupon = await CouponModel.findOne({ code: req.params.code, expiredAt: { $gt: Date.now() } });
    if (!coupon) return next(new AppError("There are no Coupon with that code", 400));

    coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
    coupon.expiredAt = req.body.expiredAt ? req.body.expiredAt : coupon.expiredAt;
    await coupon.save();

    sendData(201, "success", "Coupon updated successfully", coupon, res);
});


export const deleteCoupon = catchAsync(async (req, res, next) => {
    const coupon = await CouponModel.findOne({ code: req.params.code });
    if (!coupon) return next(new AppError("There are no Coupon with that code", 400));

    // check owner
    if (req.user._id !== coupon.createdBy.toString()) return next(new AppError("You are not the owner!", 400));
    await CouponModel.findOneAndDelete({ code: req.params.code });
    sendData(200, "success", "Coupon deleted successfully", undefined, res);
});