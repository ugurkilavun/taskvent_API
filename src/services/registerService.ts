import bcrypt from "bcrypt";
// Utils
import { signToken } from "../utils/jwt";
import { statusCodeErrors } from "../utils/statusCodeErrors";
// Repositories
import { checkEmailOrUsername, insertUser } from "../repositories/userRepository";
// Types
import { UserType } from "../types/users";

const registerService = async (DATA: UserType): Promise<object> => {

  if (Object.values(DATA).some(x => x === undefined)) throw new statusCodeErrors("Incomplete data!", 400);

  const username_: unknown = await checkEmailOrUsername(DATA.username);
  if (username_) throw new statusCodeErrors("Username already exists!", 409);

  const email_: unknown = await checkEmailOrUsername(DATA.email);
  if (email_) throw new statusCodeErrors("Email already exists!", 409);

  const salt = bcrypt.genSaltSync(10);
  const paswdHash = bcrypt.hashSync(DATA.password, salt);

  const userIn = await insertUser({
    firstname: DATA.firstname,
    lastname: DATA.lastname,
    username: DATA.username,
    email: DATA.email,
    password: paswdHash,
    dateOfBirth: DATA.dateOfBirth,
    country: DATA.country,
  });

  const ACCESS_TOKEN: string = signToken({ id: (userIn._id).toJSON(), username: userIn.username, created_at: new Date() }, "access", '5s');

  const REFRESH_TOKEN: string = signToken({ id: (userIn._id).toJSON(), username: userIn.username, created_at: new Date() }, "refresh", '5d');

  return { message: "Registration Successful.", access_token: ACCESS_TOKEN, refresh_token: REFRESH_TOKEN };
};

export default registerService;