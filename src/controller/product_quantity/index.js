import typeorm from "typeorm";
import { ProductsQuantityEntity } from "../../entities/products_quantity.js";
import {
  invalidIdExeption,
  missingInputException,
  sendErrorResponse,
  orderDoesNotExistException,
} from "../../exceptions/index.js";
import { getUserIdFromJwt } from "../../utils/user.js";

const { getRepository } = typeorm;

export const getAllProductsQuantity = async (_, res) => {
  const productQuantityRepository = getRepository(ProductsQuantityEntity);

  try {
    const productsQuantity = await productQuantityRepository.find();
    return res.status(200).json(productsQuantity);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

export const getProductQuantityByOrderId = async (orderId, res) => {
  const productQuantityRepository = getRepository(ProductsQuantityEntity);

  try {
    const productsQuantity = await productQuantityRepository.find({
      where: { orderId },
    });

    if (!productsQuantity?.length) return [];

    return productsQuantity;
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

export const createProductQuantity = async (data, res) => {
  const productQuantityRepository = getRepository(ProductsQuantityEntity);
  const { orderId, productId, quantity } = data;

  try {
    if (!orderId || !productId || !quantity) throw missingInputException;

    const newProductQuantity = productQuantityRepository.create({
      ...data,
    });

    const createdProductQuantity = await productQuantityRepository.insert(
      newProductQuantity
    );

    const productQuantityData = await productQuantityRepository.findOne({
      where: { id: createdProductQuantity.identifiers[0].id },
    });

    return productQuantityData;
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

export const updateProductQuantity = async (req, res) => {
  const productQuantityRepository = getRepository(ProductsQuantityEntity);

  try {
    const { role } = getUserIdFromJwt(req.headers);

    // Extract this
    if (role !== "admin") throw new Error("No Auorizado");

    const id = +req.params.id;

    if (!id) throw invalidIdExeption;

    const existingProductQuantity = await productQuantityRepository.findOne({
      where: { id },
    });

    if (!existingProductQuantity) throw orderDoesNotExistException;

    const updatedProductQuantity = productQuantityRepository.merge(
      existingProductQuantity,
      req.body
    );

    const savedProductQuantity = await productQuantityRepository.save(
      updatedProductQuantity
    );

    return res.status(200).json(savedProductQuantity);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

export const deleteProductQuantityByOrderId = async (orderId) => {
  const productQuantityRepository = getRepository(ProductsQuantityEntity);

  try {
    if (!orderId) throw invalidIdExeption;

    const existingProductQuantity = await productQuantityRepository.findOne({
      where: { orderId },
    });

    if (!existingProductQuantity) throw orderDoesNotExistException;
    await productQuantityRepository.delete({ orderId });

    return true;
  } catch (error) {
    throw new Error(error);
  }
};
