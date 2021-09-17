// Messages
export const USER_ALREADY_EXISTS = "El usuario ya se encuentra registrado";
export const ICOMPLETE_INPUT = "Alguno de los datos requeridos está incompleto";
export const USER_NOT_EXISTS = "El usuario no existe";
export const INVALID_PASSWORD = "Contraseña incorrecta";
export const AUTH_REQUIRED = "Requiere Autorización";
export const JWT_ERROR = "JsonWebTokenError";
export const INVALID_ID = "ID Inválido";
export const PRODUCT_NOT_EXISTS = "El producto no existe";
export const ORDER_NOT_EXISTS = "La orden no existe";
export const PRODUCT_QUANTITY_NOT_EXISTS =
  "Hubo un error al obtener el detalle de la órden";

// Error type
export const badRequestErrors = [
  USER_ALREADY_EXISTS,
  ICOMPLETE_INPUT,
  INVALID_PASSWORD,
  INVALID_ID,
];

export const notFoundErrors = [
  USER_NOT_EXISTS,
  PRODUCT_NOT_EXISTS,
  ORDER_NOT_EXISTS,
  PRODUCT_QUANTITY_NOT_EXISTS,
];

export const authErrors = [AUTH_REQUIRED];

// Exceptions
export const userExistException = new Error(USER_ALREADY_EXISTS);
export const missingInputException = new Error(ICOMPLETE_INPUT);
export const userDoesNotExistException = new Error(USER_NOT_EXISTS);
export const invalidPasswordException = new Error(INVALID_PASSWORD);
export const authRequiredException = new Error(AUTH_REQUIRED);
export const invalidIdExeption = new Error(INVALID_ID);
export const productDoesNotExistException = new Error(PRODUCT_NOT_EXISTS);
export const orderDoesNotExistException = new Error(ORDER_NOT_EXISTS);
export const productQuantityDoesNotExistException = new Error(ORDER_NOT_EXISTS);

// Error handler
export const sendErrorResponse = (error, res) => {
  if (error.name === JWT_ERROR || authErrors.includes(error.message))
    return res.status(401).json(error.message);

  if (notFoundErrors.includes(error.message))
    return res.status(404).json(error.message);

  if (badRequestErrors.includes(error.message))
    return res.status(400).json(error.message);

  return res.status(500).json(error.message);
};
