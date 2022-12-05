import User from "../models/User.model.js";
import cryptoJs from "crypto-js";
import jwt from "jsonwebtoken";

export const register = async(req, res) => {
    try {
        let existingUser = req.body.email && await User.findOne({ email: req.body.email }) || req.body.username && await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).send({ success: false, Message: req.body.email && "user with this email already exists" || req.body.username && "username has been taken" });
        }
        let cipherText = cryptoJs.AES.encrypt(req.body.password, process.env.PRIVATE_KEY);
        let user = new User({
            username: req.body.username,
            email: req.body.email,
            password: cipherText
        });
        await user.save();
        return res.status(200).send({ success: true, Message: "Registered Successfully!" });
    } catch (err) {
        return res.status(200).send({ success: false, Message: err.message });
    }
}


export const login = async (req, res) => {
    try {
        //check if user exists
        let user = req.body.email && await User.findOne({ email: req.body.email }) || req.body.username && await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).send({ success: false, Message: "User Not Found!" });
        }
        //check the password
        let cipher = user.password;
        //Decrypt
        let bytes = cryptoJs.AES.decrypt(cipher, process.env.PRIVATE_KEY);
        let originalPassword = bytes.toString(cryptoJs.enc.Utf8);

        if (req.body.password !== originalPassword) {
            return res.status(400).send({ success: false, Message: "email or password is invalid!" });
        }
        //sign a token
        let token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
        return res.status(200).send({ success: true, Message: "Logged In", token });
    } catch (err) {
        return res.status(200).send({ success: false, Message: err.message });
    }
}

