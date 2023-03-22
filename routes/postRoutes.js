import express from "express";

import validateTokenHandler from "../middleware/validateTokenHandler.js";

import {
    getPosts,
    createPost,
    getPost,
    updatePost,
    deletePost,
} from "../controllers/postController.js";

const router = express.Router();

router.route("/").get(getPosts).post(validateTokenHandler, createPost);

router
    .route("/:id")
    .get(getPost)
    .put(validateTokenHandler, updatePost)
    .delete(validateTokenHandler, deletePost);

export default router;
