import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import connectDB from "./config/dbConfig.js";

import errorHandler from "./middleware/errorHandler.js";

import userRoutes from "./routes/userRoutes.js";
// import postRoutes from "./routes/postRoutes.js";
// import commentRoutes from "./routes/commentRoutes.js";

dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Body parser middleware
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

app.use("/users", userRoutes);
// app.use("/posts", postRoutes);
// app.use("/comments", commentRoutes);
app.use(errorHandler);

app.listen(PORT, () =>
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
