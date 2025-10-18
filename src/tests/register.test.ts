import request from "supertest";
// Server
import app from "../app";
// import { server } from "../server";
// .env
import dotenv from 'dotenv';

dotenv.config({ quiet: true })

describe("POST /register", () => {

  beforeEach(() => {
    // connectDB();
  });

  // Users
  const firstname = process.env.TEST_FIRSTNAME;
  const lastname = process.env.TEST_LASTNAME;
  const username = process.env.TEST_USERNAME;
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;
  const dateOfBirth = process.env.TEST_DATEOFBIRTH;
  const country = process.env.TEST_COUNTRY;

  it("It should return 201 Created with the tokens.", async () => {

    const res: any = await request(app).post('/register').send({
      firstname: firstname,
      lastname: lastname,
      username: username,
      email: email,
      password: password,
      dateOfBirth: dateOfBirth,
      country: country
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Registration Successful.');
    expect(res.body.access_token.split(".")).toHaveLength(3);
    expect(res.body.refresh_token.split(".")).toHaveLength(3);
  });

  it("It should return 401 Unauthorized with an error message.", async () => {
    const res: any = await request(app).post('/register').send({
      firstname: firstname,
      lastname: lastname,
      username: username,
      email: email,
      password: password,
      dateOfBirth: dateOfBirth,
      country: country
    });

    expect(res.statusCode).toEqual(409);
    expect(res.body.message).toMatch(/already exists./);
  });

  it("It should return 400 Bad Request with an error message.", async () => {
    const res: any = await request(app).post('/register').send({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      dateOfBirth: dateOfBirth,
      country: country
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Incomplete data.');
  });

});