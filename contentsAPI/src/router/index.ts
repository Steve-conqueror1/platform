import Router from "koa-router";
import { getPublishedDocumentById } from "../controllers";
import { getPublishedDocuments } from "../controllers";

export const contentRouter = new Router();
contentRouter.get("/api/documents", getPublishedDocuments);
contentRouter.get("/api/documents/:id", getPublishedDocumentById);
