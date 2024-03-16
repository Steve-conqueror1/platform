import { Context, Next } from "koa";
import { pool } from "../config";
import NodeCache from "node-cache";

const cache = new NodeCache();

export const getPublishedDocuments = async (ctx: Context) => {
  try {
    const key = ctx.request.url;
    const cachedData = cache.get(key);

    console.log("cached Data", cachedData);

    if (cachedData) {
      console.log("Cache hit");
      ctx.body = cachedData;
      return;
    }

    const query = `SELECT * FROM Document
      WHERE status = $1;
      `;

    const queryResult = await pool.query(query, ["published"]);
    const documents = queryResult.rows;
    ctx.body = documents;
    ctx.status = 200;
    cache.set(key, ctx.body, 20);
  } catch (error) {
    ctx.body = { message: "Error viewing  documents" };
    console.log("Error", error);
  }
};

/**
 * Get a speciffic published document by id
 * Endpoint uses caching mechanisms
 */

export const getPublishedDocumentById = async (ctx: Context) => {
  try {
    const key = ctx.request.url;
    const cachedData = cache.get(key);

    if (cachedData) {
      console.log("Cache hit");
      ctx.body = cachedData;
      return;
    }
    const docId = ctx.params.id;
    const query = `SELECT * FROM Document
        WHERE status = $1 
        AND document_id = $2;
      `;

    const queryResult = await pool.query(query, ["published", docId]);
    const documents = queryResult.rows;
    ctx.body = documents;
    ctx.status = 200;
    cache.set(key, ctx.body, 10);
  } catch (error) {
    ctx.body = { message: "Error viewing documents" };
    console.log("Error", error);
  }
};
