import express from 'express';
import { isValid } from './../../middleware/validation.js';
import { createBrandSchema, deleteBrandSchema, updateBrandSchema } from './brand.validation.js';
import { isAuthenticated } from './../../middleware/authentication.middleware.js';
import { isAuthorized } from '../../middleware/authorization.middleware.js';
import * as brandController from './brand.controller.js';
import { fileUpload, filterObject } from '../../utils/multer.js';
const brandRouter = express.Router();

brandRouter.post('/addBrand',
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(filterObject.image).single("brand"),
    isValid(createBrandSchema),
    brandController.createBrand
);

brandRouter.patch('/updateBrand/:brandId',
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(filterObject.image).single("brand"),
    isValid(updateBrandSchema),
    brandController.updateBrand
);

brandRouter.delete('/deleteBrand/:brandId',
    isAuthenticated,
    isAuthorized("admin"),
    isValid(deleteBrandSchema),
    brandController.deleteBrand
);

brandRouter.get('/', brandController.getAllBrands);
export default brandRouter;