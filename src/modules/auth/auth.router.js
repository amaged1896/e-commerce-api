import express from "express";
import { isValid } from "../../middleware/validation.js";
import { activationSchema, forgetCodeSchema, loginSchema, resetPasswordSchema, signUpSchema } from "./auth.validation.js";
import * as authController from "./auth.controller.js";
const authRouter = express.Router();

// Register 
authRouter.post('/signup', isValid(signUpSchema), authController.signup);

// Activation Code
authRouter.get('/confirmEmail/:activationCode', isValid(activationSchema), authController.activateAccount);

// Login
authRouter.post('/login', isValid(loginSchema), authController.login);

// send forgot password code
authRouter.patch('/forgotPassword', isValid(forgetCodeSchema), authController.sendForgetCode);
// Reset Password 
authRouter.patch('/resetPassword', isValid(resetPasswordSchema), authController.resetPassword);


export default authRouter;