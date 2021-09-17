import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
} from "../controller/product/index.js";

const router = Router();

router.get("/v1/products/", getAllProducts);

router.get("/v1/products/:id", getOneProduct);

router.post("/v1/products/", createProduct);

router.put("/v1/products/:id", updateProduct);

router.delete("/v1/products/:id", deleteProduct);

export default router;
