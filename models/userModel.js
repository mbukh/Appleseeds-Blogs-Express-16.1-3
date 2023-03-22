import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            minlength: [2, "Name is too short."],
            maxlength: [25, "Name is too long."],
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            maxlength: [35, "Email is too long."],
            required: [true, "Email is required"],
            unique: [true, "Email already registered"],
        },
        password: {
            type: String,
            minlength: 4,
            required: [true, "Password is required"],
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema, "users");
