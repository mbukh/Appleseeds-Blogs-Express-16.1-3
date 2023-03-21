const errorHandler = (error, req, res, next) => {
    // MONGO DB ERROR error: {name, code, -message-}
    // MANUAL ERROR: error: { message }

    let err = { ...error };

    console.log(error.stack);

    

    res.status(err.statusCode || 500).json({
        success: false,
        error: JSON.stringify(err) || "Server Error",
    });
};

export default errorHandler;
