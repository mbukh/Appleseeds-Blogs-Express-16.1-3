import mongoose from "mongoose";

import slugify from "slugify";

// title: String
// content: String
// comments: [ref, ref...]
// postedBy: ref

const postSchema = mongoose.Schema(
    {
        title: {
            type: String,
            minlength: [2, "Title is too short."],
            maxlength: [75, "Title is too long."],
            required: [true, "Title is required"],
        },
        slug: String,
        content: {
            type: String,
            minlength: [1, "Content is too short."],
            maxlength: [3000, "Content is too long."],
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// Middleware - Create slug from name
postSchema.pre("save", function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

export default mongoose.model("Post", postSchema, "posts");
