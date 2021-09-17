import { verifyWithJwt } from "./jwt.js";
import { authRequiredException } from "../exceptions/index.js";

export const getUserIdFromJwt = ({ authorization: jwt }) => {
  if (!jwt) throw authRequiredException;

  const { id, role } = verifyWithJwt(jwt);

  return { id, role };
};

export const getEmailFromJwt = ({ authorization: jwt }) => {
  if (!jwt) throw authRequiredException;

  const { email } = verifyWithJwt(jwt);

  return email;
};
