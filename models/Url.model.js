import mongoose, { Schema } from "mongoose";

const urlSchema = new Schema({
    link: {
        type: String,
    }
}, { timestamps: true });

export default mongoose.model('Url', urlSchema);