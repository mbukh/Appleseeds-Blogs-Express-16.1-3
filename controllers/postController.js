import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import resCodes from "../constants/resCodes.js";

import PostModel from "../models/postModel.js";

//@desc Get all posts
//@route GET /posts
//@access public
export const getPosts = expressAsyncHandler(async (req, res, next) => {
    const posts = await PostModel.find();

    if (!posts) {
        res.status(resCodes.SERVER_ERROR);
        throw new Error("Can't get posts.");
    }

    res.status(resCodes.OK).json({
        success: true,
        data: posts,
    });
});

//@desc Create a post
//@route POST /posts
//@access private
export const createPost = expressAsyncHandler(async (req, res, next) => {
    const post = { ...req.body };

    if (!post.title || !req.user.id) {
        res.status(resCodes.VALIDATION_ERROR);
        throw new Error("Post data invalid.");
    }

    const newPost = await PostModel.create({
        title: post.title,
        content: post.content,
        postedBy: req.user.id,
    });

    if (!newPost) {
        res.status(resCodes.SERVER_ERROR);
        throw new Error("Unable to create a post.");
    }

    res.status(resCodes.CREATED).json({
        success: true,
        data: post,
    });
});

//@desc Get a post
//@route GET /posts/:id
//@access public
export const getPost = expressAsyncHandler(async (req, res, next) => {
    const post = await PostModel.findById(req.params.id);

    if (!post) {
        res.status(resCodes.NOT_FOUND);
        throw new Error("Post not found.");
    }

    res.status(resCodes.OK).json({
        status: true,
        data: post,
    });
});

//@desc Update a post
//@route PUT /posts/:id
//@access private
export const updatePost = expressAsyncHandler(async (req, res, next) => {
    let post = await PostModel.findById(req.params.id);

    if (!post) {
        res.status(resCodes.NOT_FOUND);
        throw new Error(`Post with ${req.params.id} not found.`);
    }

    if (post.postedBy.toString() !== req.user.id) {
        
    }

     post = await PostModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );
 
    res.status(resCodes.OK).json({
        success: true,
        data: updatedPost,
    });
});

//@desc Delete a post
//@route DELETE /posts/:id
//@access private
export const deletePost = expressAsyncHandler(async (req, res, next) => {
    const post = await PostModel.findByIdAndDelete(req.params.id);

    if (!post) {
        res.status(resCodes.NOT_FOUND);
        throw new Error("Post not found.");
    }

    res.status(resCodes.OK).json({
        status: true,
        data: post,
    });
});

//@desc Login a post
//@route GET /api/posts/login
//@access public
export const loginPost = expressAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(resCodes.VALIDATION_ERROR);
        throw new Error("All fields are mandatory");
    }
    const post = await PostModel.findOne({ email });

    // compare password with hashed password
    if (post && (await bcrypt.compare(password, post.password))) {
        const accessToken = jwt.sign(
            {
                post: {
                    title: post.title,
                    email: post.email,
                    id: post.id,
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

//@desc Current post info
//@route GET /api/posts/current
//@access private
export const currentPost = expressAsyncHandler(async (req, res) => {
    res.json(req.post);
});

PostSchema.pre("save", function (next) {
    console.log(this.password);
    next();
});

// TODO: 4. Get products with a specific price range (example min = 50 max = 500)
