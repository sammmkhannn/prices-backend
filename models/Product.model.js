import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    link: {
        type: String,
    },
    title: {
        type: String,
    },
    price: {
        type: String,
    },
    oldPrice: {
        type: String,
    }
});

export default mongoose.model("Product", productSchema);