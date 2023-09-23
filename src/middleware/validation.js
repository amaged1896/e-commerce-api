import { AppError } from './../utils/appError.js';

export const isValid = (schema) => {
    return (req, res, next) => {
        const reqCopy = { ...req.body, ...req.params, ...req.query };
        const validationResult = schema.validate(reqCopy, { abortEarly: false });

        if (validationResult.error) {
            const messages = validationResult.error.details.map((error) => error.message);
            return next(new AppError(messages, 404));
        }
        return next();
    };
};