import resCodes from "../constants/resCodes.js";
import mongooseResCodes from "../constants/mongooseResCodes.js";

const errorHandler = (error, req, res, next) => {
    // MONGO DB ERROR error: {name, code, -message-}
    // MANUAL ERROR: error: { message }
    let err = { ...error };

    console.log(error.stack);

    // Mongoose bad ObjectId
    if (error.name === "CastError") {
        const message = `Resource not found with id that end with ${error.value.slice(
            -6
        )} was not found`;
        err = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (error.code === mongooseResCodes.DUPLICATE) {
        const message = "Duplicate field value entered";
        err = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
        err = new ErrorResponse(message, 400);
    }

    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || "Server Error",
    });
};

export default errorHandler;
