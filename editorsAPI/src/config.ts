import { Config } from "./types";
import logger from "koa-logger";
import { DatabaseError } from "pg";

import dotenv from "dotenv";
dotenv.config();

export const config: Config = {
  port: process.env.PORT || "5000",
};

// DB
const Pool = require("pg").Pool;

export const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === "testing"
      ? process.env.DATABASE__TEST_URL
      : process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("connected to the db");
});

pool.on("error", (err: DatabaseError) => {
  console.error("pg.Pool emitted error", err);
  process.exit(-1);
});
