import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOneOrder,
  updateOrder,
} from "../controller/order/index.js";

const router = Router();

router.get("/v1/orders/", getAllOrders);

router.get("/v1/orders/:id", getOneOrder);

router.post("/v1/orders/", createOrder);

router.put("/v1/orders/:id", updateOrder);

router.delete("/v1/orders/:id", deleteOrder);

export default router;
