import bcrypt from "bcrypt";
// Utils
import { signToken } from "../utils/jwt";
import { statusCodeErrors } from "../utils/statusCodeErrors";
// Repositories
import { findByEmailOrUsername } from "../repositories/userRepository";
// Types
import { authResponseType } from "../types/responses";

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