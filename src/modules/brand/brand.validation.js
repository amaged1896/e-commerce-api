import joi from 'joi';
import { isValidObjectId } from '../../middleware/validation.js';

export const createBrandSchema = joi.object({
    name: joi.string().min(4).max(15).required(),
}).required();

export const updateBrandSchema = joi.object({
    name: joi.string().min(4).max(15),
    brandId: joi.string().custom(isValidObjectId).required(),
}).required();

export const deleteBrandSchema = joi.object({
    brandId: joi.string().custom(isValidObjectId).required(),
}).required();