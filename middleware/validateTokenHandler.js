import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import resCodes from "../constants/resCodes.js";

const validateTokenHandler = expressAsyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(resCodes.UNAUTHORIZED);
                next(new Error("User is not authorized"));
            }
            req.user = decoded.user;
            next();
        });

        if (!token) {
            res.status(resCodes.UNAUTHORIZED);
            next(new Error("User is not authorized or token is missing"));
        }
    }
});

export default validateTokenHandler;
