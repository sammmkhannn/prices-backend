import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    }
}, {
    timestamps:true,
});


export default mongoose.model("User", userSchema);
