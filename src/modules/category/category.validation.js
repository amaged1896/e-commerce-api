import joi from 'joi';
import { Types } from 'mongoose';

const isValidObjectId = (value, helper) => {
    if (Types.ObjectId.isValid(value)) {
        return true;
    } else {
        return helper.message('Invalid objectId');
    }
};

export const createCategorySchema = joi.object({
    name: joi.string().min(4).max(15).required(),
    createdBy: joi.string().custom(isValidObjectId),
}).required();

export const updateCategorySchema = joi.object({
    name: joi.string().min(4).max(15),
    categoryId: joi.string().custom(isValidObjectId),
}).required();

export const deleteCategorySchema = joi.object({
    categoryId: joi.string().custom(isValidObjectId),
}).required();