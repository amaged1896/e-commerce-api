import express from "express";
import { isAuthenticated } from "./../../middleware/authentication.middleware.js";
import { isAuthorized } from "./../../middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import {
    createProductSchema,
    productIdSchema,
    updateProductSchema,
} from "./product.validation.js";
import * as productControllers from "./product.controller.js";
const productRouter = express.Router({ mergeParams: true });

productRouter
    .route("/")
    .get(productControllers.getAllProducts)
    // create
    .post(
        isAuthenticated,
        isAuthorized("admin"),
        fileUpload(filterObject.image).fields([
            { name: "defaultImage", maxCount: 1 },
            { name: "subImages", maxCount: 5 },
        ]),
        isValid(createProductSchema),
        productControllers.addProduct
    );

productRouter
    .route("/:productId")
    // get single product
    .get(isValid(productIdSchema), productControllers.getSingleProduct)
    // update product
    .patch(isAuthenticated, isAuthorized("admin"),
        fileUpload(filterObject.image).fields([
            { name: "defaultImage", maxCount: 1 },
            { name: "subImages", maxCount: 5 }]),
        isValid(updateProductSchema),
        productControllers.updateProduct
    )
    // delete product
    .delete(
        isAuthenticated,
        isAuthorized("admin"),
        fileUpload(filterObject.image).fields([
            { name: "defaultImage", maxCount: 1 },
            { name: "subImages", maxCount: 5 },
        ]),
        isValid(productIdSchema),
        productControllers.deleteProduct
    );

export default productRouter;
