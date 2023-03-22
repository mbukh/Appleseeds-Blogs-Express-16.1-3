import express from "express";

import validateTokenHandler from "../middleware/validateTokenHandler.js";

import {
    getUsers,
    createUser,
    getUser,
    updateUser,
    loginUser,
    deleteUser,
    currentUser,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").get(getUsers);

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/current", validateTokenHandler, currentUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

export default router;
