import express from 'express';
import { isValid } from './../../middleware/validation.js';
import { createCategorySchema, deleteCategorySchema, updateCategorySchema } from './category.validation.js';
import { isAuthenticated } from './../../middleware/authentication.middleware.js';
import { isAuthorized } from '../../middleware/authorization.middleware.js';
import * as categoryController from './category.controller.js';
import { fileUpload, filterObject } from '../../utils/multer.js';
import subcategoryRouter from '../subcategory/subcategory.router.js';
import productRouter from '../product/product.router.js';
import { getCategoryProducts } from '../product/product.controller.js';
const categoryRouter = express.Router();


categoryRouter.use("/:categoryId/subcategory", subcategoryRouter);
categoryRouter.use("/:categoryId/products", productRouter);

categoryRouter.post('/addCategory',
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(filterObject.image).single("category"),
    isValid(createCategorySchema),
    categoryController.createCategory
);

categoryRouter.patch('/updateCategory/:categoryId',
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(filterObject.image).single("category"),
    isValid(updateCategorySchema),
    categoryController.updateCategory
);

categoryRouter.delete('/deleteCategory/:categoryId',
    isAuthenticated,
    isAuthorized("admin"),
    isValid(deleteCategorySchema),
    categoryController.deleteCategory
);

categoryRouter.get('/getCategories', categoryController.getAllCategories);
categoryRouter.get('/getCategoryProducts', getCategoryProducts);

export default categoryRouter;