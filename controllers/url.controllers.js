import Url from "../models/Url.model.js";
import Product from "../models/Product.model.js";



export const setUrls = async (req, res) => {
    try {
        
        let urls = req.body.urls.split("\n");
        urls = urls.map(url => {  return { link: url } });
        //remove existing urls
        await Url.collection.deleteMany({});
        //set the new urls
        await Url.create(...urls);

        res.status(200).send({ success: true, Message: "Successfully set the urls!" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, Message: err.message });
    }
}


export const resetUrls = async (req, res) => {
    try {
        await Url.deleteMany({});//remove all the urls
        await Product.deleteMany({});//remove all the product info
        return res.status(200).send({ success: true, Message: "Successfully reset all the existing urls!" });
    } catch (err) {
        return res.status(500).send({ success: false, Message: err.message });
    }
}



