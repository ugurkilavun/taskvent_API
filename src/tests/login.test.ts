import request from "supertest";
// Server
import app from "../app";
// .env
import dotenv from 'dotenv';

dotenv.config({ quiet: true })

describe("POST /login", () => {

  // beforeEach(() => {
  // });

  // Users
  const username: string = process.env.TEST_USERNAME;
  const password: string = process.env.TEST_PASSWORD;
  // Fake Users
  const fusername: string = "test@test.com";
  const fpassword: string = "12345";

  it("It should return 200 OK with the tokens.", async () => {
    const res: any = await request(app).post('/login').send({ username_or_email: username, password: password });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Login successful.');
    expect(res.body.access_token.split(".")).toHaveLength(3);
    expect(res.body.refresh_token.split(".")).toHaveLength(3);
  });

  it("It should return a 401 Unauthorized response.", async () => {
    const res: any = await request(app).post('/login').send({ username_or_email: fusername, password: fpassword });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Username or email not found!');
  });

  it("It should return 400 Bad Request.", async () => {
    const res: any = await request(app).post('/login').send({ username_or_email: username });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Incomplete data!');
  });
});

// afterAll((done) => {
//   server.close(done);
// })