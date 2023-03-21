import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import UserModel from "../models/userModel.js";

import { validateEmail } from "../utils/validate.js";

//@desc Get all users
//@route GET /users
//@access public
export const getUsers = expressAsyncHandler(async (req, res, next) => {
    const users = await UserModel.find();
    if (!users) {
        next(new Error(`User with id ${req.params.id} not found.`));
    }
    res.status(200).json({
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
        next(new Error("User data invalid."));
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = await UserModel.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
    });

    if (!newUser) {
        next(new Error("Unable to create a user."));
    }

    res.status(201).json({
        success: true,
        data: { _id: newUser.id, email: newUser.email },
    });
});

//@desc Get a user
//@route GET /users/:id
//@access public
export const getUser = expressAsyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
        next(new Error("User not found."));
    }

    res.status(200).json({
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
        next(new Error("User update data invalid."));
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
        next(new Error("Unable to update a user."));
    }

    res.status(200).json({
        success: true,
        data: updatedUser,
    });
});

export const deleteUser = expressAsyncHandler(async (req, res, next) => {
    
});

export const deleteUser = expressAsyncHandler(async (req, res, next) => {

});
