import { getRepository } from "typeorm";
import { UserEntity } from "../../entities/user.js";
import {
  invalidPasswordException,
  missingInputException,
  sendErrorResponse,
  userDoesNotExistException,
  userExistException,
} from "../../exceptions/index.js";
import { findElementByArgs } from "../../utils/db.js";
import { signWithJwt } from "../../utils/jwt.js";
import { getEmailFromJwt, getUserIdFromJwt } from "../../utils/user.js";
import { registerInput } from "../user/inputSchema.js";

export const registerUser = async (req, res) => {
  const userRepository = getRepository(UserEntity);

  try {
    const inputKeys = Object.keys(req.body);

    const missingKey = registerInput.filter((key) => !inputKeys.includes(key));

    if (missingKey.length > 0) throw missingInputException;

    const { email } = req.body;

    const existingUser = await findElementByArgs(userRepository, { email });

    if (existingUser) {
      throw userExistException;
    }

    const newUser = userRepository.create(req.body);

    const createdUser = await userRepository.insert(newUser);

    const { role } = req.body;
    const jwt = signWithJwt({
      email,
      id: createdUser.identifiers[0].id,
      role,
    });

    return res.status(201).json({ jwt });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

export const loginUser = async (req, res) => {
  const userRepository = getRepository(UserEntity);

  try {
    const { email, password } = req.body;

    const existingUser = await findElementByArgs(userRepository, { email });

    if (!existingUser) {
      throw userDoesNotExistException;
    }

    if (password !== existingUser.password) {
      throw invalidPasswordException;
    }

    const jwt = signWithJwt({
      email,
      id: existingUser.id,
      role: existingUser.role,
    });

    return res.status(201).json({ jwt });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

export const getUsers = async (req, res) => {
  const userRepository = getRepository(UserEntity);

  try {
    const { role } = getUserIdFromJwt(req.headers);
    // Extract this
    if (role !== "admin") throw new Error("No Auorizado");

    const users = await userRepository.find();

    return res.status(200).json(users);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

export const getMe = async (req, res) => {
  const userRepository = getRepository(UserEntity);

  try {
    const email = getEmailFromJwt(req.headers);

    const user = await userRepository.findOne({ where: { email } });

    if (!user) throw userDoesNotExistException;

    const { firstName, lastName, id, role } = user;

    return res.status(200).json({ id, firstName, lastName, email, role });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
