import bcrypt from "bcrypt";
import dotenv from 'dotenv';
// Utils
import { signToken } from "../utils/jwt";
import { statusCodeErrors } from "../utils/statusCodeErrors";
import { generateURLToken, hashURLToken } from "../utils/urlTokens";
// Repositories
import { checkEmailOrUsername, insertUser } from "../repositories/userRepository";
import { insertVerify } from "../repositories/verifyRepository";
// Types
import { UserType } from "../types/users";
// Services
import { sendVerificationEmail } from "./mailService";

// .env config
dotenv.config({ quiet: true });

const registerService = async (DATA: UserType): Promise<object> => {

  if (Object.values(DATA).some(x => x === undefined)) throw new statusCodeErrors("Incomplete data.", 400);

  const username_: unknown = await checkEmailOrUsername(DATA.username);
  if (username_) throw new statusCodeErrors("Username already exists.", 409);

  const email_: unknown = await checkEmailOrUsername(DATA.email);
  if (email_) throw new statusCodeErrors("Email already exists.", 409);

  const salt = bcrypt.genSaltSync(10);
  const paswdHash = bcrypt.hashSync(DATA.password, salt);

  // * Generate URL Token
  const urlToken: string = generateURLToken();
  const hash_URLToken = hashURLToken(urlToken);

  // console.log(urlToken);

  // * Insert user
  const userIn: any = await insertUser({
    firstname: DATA.firstname,
    lastname: DATA.lastname,
    username: DATA.username,
    email: DATA.email,
    password: paswdHash,
    dateOfBirth: DATA.dateOfBirth,
    country: DATA.country,
  });
  if (!userIn) throw new statusCodeErrors("Registration failed.", 400);

  // * Insert verify
  const verifyIn: unknown = await insertVerify({
    id: userIn._id.toString(),
    token: hash_URLToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    used: false
  });
  if (!verifyIn) throw new statusCodeErrors("Email verification URL could not be created.", 400);

  // * Send Verification Email
  sendVerificationEmail(
    DATA.email,
    `${DATA.firstname} ${DATA.lastname}`,
    `${process.env.URL}/verify?vToken=${urlToken}`,
    DATA.country
  );

  const ACCESS_TOKEN: string = signToken({ id: (userIn._id).toJSON(), username: userIn.username, created_at: new Date() }, "access", '5s');

  const REFRESH_TOKEN: string = signToken({ id: (userIn._id).toJSON(), username: userIn.username, created_at: new Date() }, "refresh", '5d');

  return { message: "Registration Successful.", access_token: ACCESS_TOKEN, refresh_token: REFRESH_TOKEN };
};

export default registerService;