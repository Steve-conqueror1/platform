import Koa, { Next } from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import logger from "koa-logger";

import { contentRouter } from "./router";

const app = new Koa();

app.use(bodyParser());

app.use(
  cors({
    origin: "*",
  })
);

app.use(logger());

app.use(contentRouter.routes());

app.on("error", (err) => {
  console.log(err);
});

export { app };
