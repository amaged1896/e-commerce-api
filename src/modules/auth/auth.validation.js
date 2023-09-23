import joi from 'joi';

export const signUpSchema = joi.object({
    userName: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref('password')).required(),
}).required();

export const activationSchema = joi.object({
    activationCode: joi.string().required(),

}).required();

export const loginSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required(),
}).required();

export const forgetCodeSchema = joi.object({
    email: joi.string().email().required(),
}).required();

export const resetPasswordSchema = joi.object({
    email: joi.string().email().required(),
    forgetCode: joi.string().min(6).max(6).required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref('password')).required(),
}).required();