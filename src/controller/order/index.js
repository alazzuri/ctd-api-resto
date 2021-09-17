import { getRepository } from "typeorm";
import { OrderEntity } from "../../entities/order.js";
import { ProductEntity } from "../../entities/product.js";
import {
  invalidIdExeption,
  missingInputException,
  sendErrorResponse,
  orderDoesNotExistException,
} from "../../exceptions/index.js";
import { ORDER_DELETED } from "../../utils/constants.js";
import { findElementById } from "../../utils/db.js";
import { getUserIdFromJwt } from "../../utils/user.js";
import {
  createProductQuantity,
  deleteProductQuantityByOrderId,
  getProductQuantityByOrderId,
} from "../product_quantity/index.js";
import { orderInput } from "./inputSchema.js";

export const getAllOrders = async (req, res) => {
  const ordersRepository = getRepository(OrderEntity);
  let orders;

  try {
    const { id, role } = getUserIdFromJwt(req.headers);

    if (role === "admin") {
      orders = await ordersRepository.find();
    } else {
      orders = await ordersRepository.find({ where: { userId: id } });
    }

    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const products = await getProductQuantityByOrderId(order.id, res);

        return {
          ...order,
          products,
        };
      })
    );

    return res.status(200).json(ordersWithProducts);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

export const getOneOrder = async (req, res) => {
  const ordersRepository = getRepository(OrderEntity);
  let existingOrder;

  try {
    const { role, id: userId } = getUserIdFromJwt(req.headers);

    const id = +req.params.id;

    if (!id) throw invalidIdExeption;

    if (role === "admin") {
      existingOrder = await await ordersRepository.findOne({
        where: { id },
      });
    } else {
      existingOrder = await ordersRepository.findOne({ where: { userId, id } });
    }

    if (!existingOrder) throw orderDoesNotExistException;

    const products = await getProductQuantityByOrderId(existingOrder.id, res);

    return res.status(200).json({ ...existingOrder, products });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

export const createOrder = async (req, res) => {
  const ordersRepository = getRepository(OrderEntity);
  const productRepository = getRepository(ProductEntity);

  try {
    const { role } = getUserIdFromJwt(req.headers);

    // Extract this
    if (role !== "admin") throw new Error("No Auorizado");

    const inputKeys = Object.keys(req.body);

    const missingKey = orderInput.filter((key) => !inputKeys.includes(key));

    if (missingKey.length > 0) throw missingInputException;
    const { products } = req.body;

    const selectedProducts = await Promise.all(
      products.map(async (product) => {
        const productData = await findElementById(
          productRepository,
          product.productId
        );

        return { ...productData, quantity: product.quantity };
      })
    );

    const amount = selectedProducts.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );

    const newOrder = ordersRepository.create({ ...req.body, amount });

    const createdOrder = await ordersRepository.insert(newOrder);

    const orderData = await ordersRepository.findOne({
      where: { id: createdOrder.identifiers[0].id },
    });

    const productsData = await Promise.all(
      products.map((product) =>
        createProductQuantity({ ...product, orderId: orderData.id }, res)
      )
    );

    const responseData = { ...orderData, products: productsData };

    return res.status(201).json(responseData);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

export const updateOrder = async (req, res) => {
  const ordersRepository = getRepository(OrderEntity);

  try {
    const { role } = getUserIdFromJwt(req.headers);

    // Extract this
    if (role !== "admin") throw new Error("No Auorizado");

    const id = +req.params.id;

    if (!id) throw invalidIdExeption;

    const existingOrder = await ordersRepository.findOne({
      where: { id },
    });

    if (!existingOrder) throw orderDoesNotExistException;

    const updatedOrder = ordersRepository.merge(existingOrder, req.body);

    const savedOrder = await ordersRepository.save(updatedOrder);

    const { products } = req.body;

    if (!products?.length) {
      const products = await getProductQuantityByOrderId(existingOrder.id, res);

      return res.status(200).json({ ...savedOrder, products });
    }

    const productsData = await Promise.all(
      products.map((product) =>
        createProductQuantity({ ...product, orderId: id }, res)
      )
    );

    const responseData = { ...savedOrder, products: productsData };

    return res.status(201).json(responseData);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

export const deleteOrder = async (req, res) => {
  const ordersRepository = getRepository(OrderEntity);

  try {
    const { role } = getUserIdFromJwt(req.headers);

    // Extract this
    if (role !== "admin") throw new Error("No Auorizado");

    const id = +req.params.id;

    if (!id) throw invalidIdExeption;

    const existingOrder = await ordersRepository.findOne({
      where: { id },
    });
    if (!existingOrder) throw orderDoesNotExistException;

    await deleteProductQuantityByOrderId(id);

    await ordersRepository.delete({ id });

    return res.status(200).json(ORDER_DELETED);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
