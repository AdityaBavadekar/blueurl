import mongoose from "mongoose";

const shortenedUrlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
    },
    urlCode: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        default: null,
    },
    shortUrl: {
        type: String,
        required: true,
    },
    redirectCount: {
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ShortenedUrl = mongoose.model("ShortenedUrl", shortenedUrlSchema);
export default ShortenedUrl;