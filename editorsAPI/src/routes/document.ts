import Router from "koa-router";
import {
  createDocument,
  editDraftDocument,
  createDraftDocument,
  publishDraft,
  documentHistory,
} from "../controller";

export const documentRouter = new Router();

documentRouter.post("/api/documents", createDocument);
documentRouter.put("/api/documents/drafts/:id", editDraftDocument);
documentRouter.get("/api/documents/drafts/:id/publish", publishDraft);
documentRouter.post("/api/documents/:id/drafts", createDraftDocument);
documentRouter.get("/api/documents/:id/history", documentHistory);
