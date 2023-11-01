
import { AppError } from '../utils/appError.js';
import { catchAsync } from './../utils/catchAsync.js';
import jwt, { decode } from 'jsonwebtoken';
import { TokenModel } from './../../DB/model/token.model.js';
import { userModel } from './../../DB/model/user.model.js';

export const isAuthenticated = catchAsync(async (req, res, next) => {
    // check token existence and type
    let token = req.headers["token"];
    if (!token || !token.startsWith(process.env.BEARER_KEY)) {
        return next(new AppError("Valid token is required!", 401));
    }
    // check payload
    token = token.split(process.env.BEARER_KEY)[1];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    if (!decoded) return next(new AppError("Invalid token!"));
    // check database token 
    const tokenDB = await TokenModel.findOne({ token, isValid: true });
    if (!tokenDB) return next(new AppError("Token Expired!"));

    // check user existence
    const user = await userModel.findOne({ email: decoded.email });
    if (!user) return next(new AppError("user not found!"));
    // pass user 
    req.user = user;
    return next();
});