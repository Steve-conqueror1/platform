import dotenv from "dotenv";
import { DatabaseError } from "pg";

dotenv.config();

export interface Config {
  port: string;
}

export const config: Config = {
  port: process.env.PORT || "8001",
};

// DB
const Pool = require("pg").Pool;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("connected to the db");
});

pool.on("error", (err: DatabaseError) => {
  console.error("pg.Pool emitted error", err);
  process.exit(-1);
});
