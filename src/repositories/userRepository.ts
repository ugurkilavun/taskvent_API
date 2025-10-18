// Models
import users from "../models/users";
// Types
import { UserType } from "../types/users";

export const findByEmailOrUsername = async (emailOrUsername: string): Promise<any> => {
  return emailOrUsername.includes("@")
    ? await users.findOne({ email: emailOrUsername }, { _id: 1, email: 1, password: 1 })
    : await users.findOne({ username: emailOrUsername }, { _id: 1, username: 1, password: 1 });
};

export const checkEmailOrUsername = async (emailOrUsername: string): Promise<any> => {
  return emailOrUsername.includes("@")
    ? await users.findOne({ email: emailOrUsername }, { _id: 1, email: 1 })
    : await users.findOne({ username: emailOrUsername }, { _id: 1, username: 1 });
};

export const insertUser = async (DATA: UserType): Promise<any> => {
  return await users.insertOne({
    firstname: DATA.firstname,
    lastname: DATA.lastname,
    username: DATA.username,
    email: DATA.email,
    password: DATA.password,
    dateOfBirth: DATA.dateOfBirth,
    country: DATA.country,
    createdAt: new Date()
  });
};