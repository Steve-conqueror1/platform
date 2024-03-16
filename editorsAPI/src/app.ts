import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import logger from "koa-logger";

import { documentRouter } from "./routes";

const app = new Koa();

app.use(bodyParser());

app.use(
  cors({
    origin: "*",
  })
);

app.use(logger());

app.use(documentRouter.routes());

app.on("error", (err) => {
  console.log(err);
});

export = app;
