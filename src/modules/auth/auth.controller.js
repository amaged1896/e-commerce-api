import { catchAsync } from './../../utils/catchAsync.js';
import { userModel } from './../../../DB/model/user.model.js';
import { AppError } from '../../utils/appError.js';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import randomstring from 'randomstring';
import { sendEmail } from './../../utils/email.js';
import { resetPassTemp, signupTemp } from '../../utils/generateHTML.js';
import { tokenModel } from './../../../DB/model/token.model.js';

export const signup = catchAsync(async (req, res, next) => {
  const { userName, email, password } = req.body;
  // check if user already exists
  const isExist = await userModel.findOne({ email });
  if (isExist) return next(new AppError("Email already registered", 409));
  // hash the user password                        // number
  const hashedPassword = await bcryptjs.hash(password, Number(process.env.SALT_ROUND));
  // generate activation code
  const activationCode = crypto.randomBytes(64).toString('hex');

  // create user
  const user = await userModel.create({ userName, email, password: hashedPassword, activationCode });

  // create confirmation link
  const link = `http://localhost:3000/api/v1/auth/confirmEmail/${activationCode}`;

  // send email
  const isSent = await sendEmail({ email, subject: "Activation Code", html: signupTemp(link, userName) });
  return isSent ? res.status(201).json({ status: "success", message: "Please Check Your Email!", data: { user } })
    : next(new AppError("Something went wrong.", 500));

});

export const activateAccount = catchAsync(async (req, res, next) => {
  // find user
  const user = await userModel.findOneAndUpdate({ activationCode: req.params.activationCode }, { verified: true, $unset: { activationCode: 1 } });
  // check if the user doesn't exist
  if (!user) return next(new AppError("User not found!", 404));

  return res.status(202).send("Your Account is now Activated!, Try to login");
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check if the user exists
  const user = await userModel.findOne({ email });
  if (!user) return next(new AppError("User not found!", 404));
  // check if the user verified
  if (!user.verified) return next(new AppError("User is not verified!, Please Confirm Your Email", 409));
  // check password
  const match = await bcryptjs.compare(password, user.password);
  if (!match) return next(new AppError("Invalid password", 400));
  // generate token
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_KEY, { expiresIn: '2d' });
  // save token to database
  await tokenModel.create({ token, user: user._id, agent: req.headers["user-agent"] });
  user.status = "online";
  await user.save();

  return res.status(200).json({ status: "success", results: token });
});

export const sendForgetCode = catchAsync(async (req, res, next) => {
  // check if user exists
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new AppError("User is not found", 404));
  // generate code
  const code = randomstring.generate({ length: 6, charset: 'numeric' });
  // save code to database
  user.forgetCode = code;
  await user.save();
  // send email
  return await sendEmail({ email: user.email, subject: "Reset Password", html: resetPassTemp(code) }) ?
    res.status(200).json({ status: "success", message: "Check your email!" }) : next(new AppError("Something went wrong!"));
});

export const resetPassword = catchAsync(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new AppError("Invalid Email!", 404));

  // check user 
  if (user.forgetCode !== req.body.forgetCode) return next(new AppError("Invalid Code!", 404));
  
  // update user password
  user = await userModel.findOneAndUpdate({ email: req.body.email }, { $unset: { forgetCode: 1 } });
  user.password = await bcryptjs.hash(req.body.password, Number(process.env.SALT_ROUND));
  await user.save();

  // Invalidate tokens
  const tokens = await tokenModel.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  // send response
  return res.status(200).json({ status: "success", message: "Password Changed Successfully, Try To Login!" });
});