import Product from "../models/Product.model.js";
import Url from "../models/Url.model.js";

export const getProductDetails = async (req, res) => {
    try {
        let productDetails = await Product.find();
        return res.status(200).send({ success: true, data: productDetails });
    } catch (err) {
        return res.status(500).send({success:false,Message:err.message});
    }
}

export const createProduct = async (req, res) => {
    try {
        let product = new Product(req.body);
       
        await product.save(); 
        let newUrl = new Url({ link: req.body.link });
        await newUrl.save();
        return res.status(200).send({ success: true, Message:"product has been created" });
    } catch (err) {
        return res.status(500).send({ success: true, Message: err.message });
    }
}
