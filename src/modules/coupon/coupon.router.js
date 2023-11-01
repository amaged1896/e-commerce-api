import express from 'express';
import { isAuthenticated } from './../../middleware/authentication.middleware.js';
import { isAuthorized } from './../../middleware/authorization.middleware.js';
import { isValid } from '../../middleware/validation.js';
import { createCouponSchema, deleteCouponSchema, updateCouponSchema } from './coupon.validation.js';
import { createCoupon, deleteCoupon, getAllCoupons, updateCoupon } from './coupon.controller.js';

const couponRouter = express.Router();


couponRouter.route("/")
    .post(isAuthenticated, isAuthorized("admin"), isValid(createCouponSchema), createCoupon)
    .get(isAuthenticated, isAuthorized("admin"), getAllCoupons);

couponRouter.route("/:code")
    .patch(isAuthenticated, isAuthorized("admin"), isValid(updateCouponSchema), updateCoupon)
    .delete(isAuthenticated, isAuthorized("admin"), isValid(deleteCouponSchema), deleteCoupon)
    .get();



export default couponRouter;