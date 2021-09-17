import { getRepository } from "typeorm";
import { ProductEntity } from "../../entities/product.js";
import { ProductsQuantityEntity } from "../../entities/products_quantity.js";
import {
  invalidIdExeption,
  missingInputException,
  sendErrorResponse,
  productDoesNotExistException,
} from "../../exceptions/index.js";
import { PRODUCT_DELETED } from "../../utils/constants.js";
import { getUserIdFromJwt } from "../../utils/user.js";
import { productInput } from "./inputSchema.js";

export const getAllProducts = async (req, res) => {
  const productsRepository = getRepository(ProductEntity);

  try {
    getUserIdFromJwt(req.headers);

    const products = await productsRepository.find();

    return res.status(200).json(products);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

export const getOneProduct = async (req, res) => {
  const productsRepository = getRepository(ProductEntity);

  try {
    getUserIdFromJwt(req.headers);

    const id = +req.params.id;

    if (!id) throw invalidIdExeption;

    const existingProduct = await productsRepository.findOne({
      where: { id },
    });

    if (!existingProduct) throw productDoesNotExistException;

    return res.status(200).json(existingProduct);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

export const createProduct = async (req, res) => {
  const productsRepository = getRepository(ProductEntity);

  try {
    const { role } = getUserIdFromJwt(req.headers);

    // Extract this
    if (role !== "admin") throw new Error("No Auorizado");

    const inputKeys = Object.keys(req.body);

    const missingKey = productInput.filter((key) => !inputKeys.includes(key));

    if (missingKey.length > 0) throw missingInputException;

    const newProduct = productsRepository.create({ ...req.body });

    const createdProduct = await productsRepository.insert(newProduct);

    const productData = await productsRepository.findOne({
      where: { id: createdProduct.identifiers[0].id },
    });

    return res.status(201).json(productData);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

export const updateProduct = async (req, res) => {
  const productsRepository = getRepository(ProductEntity);

  try {
    const { role } = getUserIdFromJwt(req.headers);

    // Extract this
    if (role !== "admin") throw new Error("No Auorizado");

    const id = +req.params.id;

    if (!id) throw invalidIdExeption;

    const existingProduct = await productsRepository.findOne({
      where: { id },
    });

    if (!existingProduct) throw productDoesNotExistException;

    const updatedProduct = productsRepository.merge(existingProduct, req.body);

    const savedProduct = await productsRepository.save(updatedProduct);

    return res.status(200).json(savedProduct);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

export const deleteProduct = async (req, res) => {
  const productsRepository = getRepository(ProductEntity);
  const productsQuantityRepository = getRepository(ProductsQuantityEntity);

  try {
    const { role } = getUserIdFromJwt(req.headers);

    // Extract this
    if (role !== "admin") throw new Error("No Auorizado");

    const id = +req.params.id;

    if (!id) throw invalidIdExeption;

    const existingProduct = await productsRepository.findOne({
      where: { id },
    });

    if (!existingProduct) throw productDoesNotExistException;

    const productInOrder = await productsQuantityRepository.findOne({
      where: { productId: id },
    });

    console.log(productInOrder);

    if (productInOrder)
      throw new Error(
        "No se puede eliminar el producto ya que existe una orden asociada mismo. "
      );

    await productsRepository.delete({ id });

    return res.status(200).json(PRODUCT_DELETED);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
