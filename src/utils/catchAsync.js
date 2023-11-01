export const catchAsync = controller => {
    return (req, res, next) => {
        controller(req, res, next).catch(err => {
            console.log("err.stack => ", err.stack);
            next(err);
        });



    };
};