import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import resCodes from "../constants/resCodes.js";

import UserModel from "../models/userModel.js";

import { validateEmail } from "../utils/validate.js";

//@desc Get all users
//@route GET /users
//@access public
export const getUsers = expressAsyncHandler(async (req, res, next) => {
    const users = await UserModel.find();

    if (!users) {
        res.status(resCodes.SERVER_ERROR);
        throw new Error("Can't get users.");
    }

    res.status(resCodes.OK).json({
        success: true,
        data: users,
    });
});

//@desc Create a user
//@route POST /users
//@access public
export const createUser = expressAsyncHandler(async (req, res, next) => {
    const user = { ...req.body };

    if (!user.name || !validateEmail(user.email) || !user.password) {
        res.status(resCodes.VALIDATION_ERROR);
        throw new Error("User data invalid.");
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = await UserModel.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
    });

    if (!newUser) {
        res.status(resCodes.SERVER_ERROR);
        throw new Error("Unable to create a user.");
    }

    res.status(resCodes.CREATED).json({
        success: true,
        data: { id: newUser.id, email: newUser.email },
    });
});

//@desc Get a user
//@route GET /users/:id
//@access public
export const getUser = expressAsyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
        res.status(resCodes.NOT_FOUND);
        throw new Error("User not found.");
    }

    res.status(resCodes.OK).json({
        status: true,
        data: user,
    });
});

//@desc Update a user
//@route PUT /users/:id
//@access private
export const updateUser = expressAsyncHandler(async (req, res, next) => {
    const user = { ...req.body };
    let updateUserData = {};

    if (!user.name && !validateEmail(user.email) && !user.password) {
        res.status(resCodes.VALIDATION_ERROR);
        throw new Error("User update data invalid.");
    }

    if (user.name) {
        updateUserData.name = user.name;
    }
    if (validateEmail(user.email)) {
        updateUserData.email = user.email;
    }
    if (user.password) {
        updateUserData.password = await bcrypt.hash(user.password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, updateUserData, {
        new: true,
    });

    if (!updatedUser) {
        res.status(resCodes.SERVER_ERROR);
        throw new Error("Unable to update a user.");
    }

    res.status(resCodes.OK).json({
        success: true,
        data: updatedUser,
    });
});

//@desc Delete a user
//@route DELETE /users/:id
//@access private
export const deleteUser = expressAsyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndDelete(req.params.id);

    if (!user) {
        res.status(resCodes.NOT_FOUND);
        throw new Error("User not found.");
    }

    res.status(resCodes.OK).json({
        status: true,
        data: user,
    });
});

//@desc Login a user
//@route GET /api/users/login
//@access public
export const loginUser = expressAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(resCodes.VALIDATION_ERROR);
        throw new Error("All fields are mandatory");
    }
    const user = await UserModel.findOne({ email });

    // compare password with hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    name: user.name,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30m" }
        );
        res.status(resCodes.OK).json({ accessToken });
    } else {
        // TODO: not working
        res.status(resCodes.UNAUTHORIZED);
        throw new Error("Email or password is not valid");
    }
});

//@desc Current user info
//@route GET /api/users/current
//@access private
export const currentUser = expressAsyncHandler(async (req, res) => {
    res.json(req.user);
});

// TODO: 4. Get products with a specific price range (example min = 50 max = 500)
