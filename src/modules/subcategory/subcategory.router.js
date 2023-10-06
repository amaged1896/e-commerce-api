import express from 'express';
import { isAuthenticated } from '../../middleware/authentication.middleware.js';
import { isAuthorized } from '../../middleware/authorization.middleware.js';
import { isValid } from '../../middleware/validation.js';
import { fileUpload, filterObject } from '../../utils/multer.js';
import { createSubCategorySchema, updateSubCategorySchema, deleteSubCategorySchema } from './subcategory.validation.js';
import * as subcategoryController from './subcategory.controller.js';

const subcategoryRouter = express.Router({ mergeParams: true });


subcategoryRouter.get('/',
    isAuthenticated,
    subcategoryController.getAllSubCategory);

subcategoryRouter.post('/',
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(filterObject.image).single("subcategory"),
    isValid(createSubCategorySchema),
    subcategoryController.createSubCategory);

subcategoryRouter.patch('/:subcategoryId',
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(filterObject.image).single("subcategory"),
    isValid(updateSubCategorySchema),
    subcategoryController.updateSubCategory);

subcategoryRouter.delete('/:subcategoryId',
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(filterObject.image).single("subcategory"),
    isValid(deleteSubCategorySchema),
    subcategoryController.deleteSubCategory);

export default subcategoryRouter;