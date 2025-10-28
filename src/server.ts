import app from "./app";
import dotenv from 'dotenv'
import http from "http";

// .env config
dotenv.config({ quiet: true });

const PORT: number | string = process.env.PORT || 5200;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`\x1b[32m[DEBUG] Server running on port ${PORT}!\x1b[0m`)
});