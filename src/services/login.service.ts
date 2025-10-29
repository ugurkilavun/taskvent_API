import bcrypt from "bcrypt";
// Utils
import { signToken } from "../utils/jwt.util";
import { statusCodeErrors } from "../utils/statusCodeErrors.util";
// Repositories
import { findByEmailOrUsername } from "../repositories/user.repository";
// Types
import { authResponseType } from "../types/responses.type";

const loginService = async (username?: string, password?: string): Promise<authResponseType> => {

  if (username === undefined || password === undefined) throw new statusCodeErrors("Incomplete data!", 400)

  const userDATAS: any = await findByEmailOrUsername(username);
  if (!userDATAS) throw new statusCodeErrors("Username or email not found!", 401);

  const passwdResult = await bcrypt.compare(password, userDATAS.password);
  if (!passwdResult) throw new statusCodeErrors("Username or email not found!", 401);

  const ACCESS_TOKEN: string = signToken({ id: (userDATAS._id).toJSON(), username: userDATAS.username, created_at: new Date() }, "access", '5s');
  const REFRESH_TOKEN: string = signToken({ id: (userDATAS._id).toJSON(), username: userDATAS.username, created_at: new Date() }, "refresh", '5d');

  return {
    response: {
      message: "Login successful.",
      access_token: ACCESS_TOKEN,
      refresh_token: REFRESH_TOKEN
    },
    userId: userDATAS._id
  };

};

export default loginService;