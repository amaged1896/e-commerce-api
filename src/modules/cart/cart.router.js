import express from 'express';
import { isAuthenticated } from '../../middleware/authentication.middleware.js';
import { isValid } from '../../middleware/validation.js';
import { cartSchema, removeProductFromCartSchema } from './cart.validation.js';
import { isAuthorized } from './../../middleware/authorization.middleware.js';
import * as cartController from './cart.controller.js';
const cartRouter = express.Router();

cartRouter.route("/")
    .post(isAuthenticated, isAuthorized("user", "admin"), isValid(cartSchema), cartController.addToCart)
    .get(isAuthenticated, isAuthorized("user"), cartController.getUserCart);

cartRouter.route("/:cartId")
    .patch(isAuthenticated, isAuthorized("user", "admin"), isValid(cartSchema), cartController.updateCart);
// .delete(isAuthenticated, isAuthorized("user", "admin"), isValid(cartSchema), cartController.updateCart)


cartRouter.patch("/:productId/removeProduct",
    isAuthenticated,
    isAuthorized("user", "admin"),
    isValid(removeProductFromCartSchema),
    cartController.removeProductFromCart);

cartRouter.patch("/clear",
    isAuthenticated,
    isAuthorized("user", "admin"),
    isValid(cartSchema),
    cartController.clearCart);


export default cartRouter;