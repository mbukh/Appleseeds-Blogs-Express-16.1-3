import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import UserModel from "../models/userModel.js";

import { validateEmail } from "../utils/validate.js";

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

export const createUser = expressAsyncHandler(async (req, res, next) => {
    const user = req.body.user;

    if (!user.name || !validateEmail(user.email) || !user.password) {
        next(new Error("User data invalid."));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = UserModel.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
    });

    if (!newUser) {
        next(new Error("Unable to create a user."));
    }

    res.status(201).json(newUser);
});

export const getUser = expressAsyncHandler(async (req, res, next) => {});

export const updateUser = expressAsyncHandler(async (req, res, next) => {});

export const deleteUser = expressAsyncHandler(async (req, res, next) => {});
