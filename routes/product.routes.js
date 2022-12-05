import { getProductDetails, createProduct } from "../controllers/product.controllers.js";
import express from "express";
const router = express.Router();



router.get('/info', getProductDetails);
router.post('/create', createProduct);
export default router;