import { setUrls, resetUrls } from "../controllers/url.controllers.js";
import express from "express";


const router = express.Router();


router.post('/set', setUrls);
router.delete('/reset', resetUrls);


export default router;