import joi from 'joi';
import { isValidObjectId } from '../../middleware/validation.js';


export const createProductSchema = joi.object({
    name: joi.string().min(2).max(50).required(),
    description: joi.string(),
    availableItems: joi.number().min(1).required(),
    price: joi.number().min(1).required(),
    discount: joi.number().min(1).max(100),
    category: joi.string().custom(isValidObjectId),
    subcategory: joi.string().custom(isValidObjectId),
    brand: joi.string().custom(isValidObjectId)

}).required();

export const updateProductSchema = joi.object({
    name: joi.string().min(2).max(50),
    description: joi.string(),
    availableItems: joi.number().min(1),
    price: joi.number().min(1),
    discount: joi.number().min(1).max(100),
    category: joi.string().custom(isValidObjectId),
    subcategory: joi.string().custom(isValidObjectId),
    brand: joi.string().custom(isValidObjectId)

}).required();



export const productIdSchema = joi.object({
    productId: joi.string().custom(isValidObjectId).required(),
}).required();