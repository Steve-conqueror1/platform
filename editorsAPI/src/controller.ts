import { Context } from "koa";
import { pool } from "./config";
import { Document, DocumentVersion } from "./types";

export const createDocument = async (ctx: Context) => {
  try {
    const { title, content, creatorId, lastUpdateAuthorId } = ctx.request
      .body as Document;

    const query = `
    INSERT INTO Document (title, content, date_created, creator_id, updated_date, last_update_author_id)
    VALUES ($1, $2, CURRENT_TIMESTAMP, $3, CURRENT_TIMESTAMP, $4)
    RETURNING *;
  `;

    const documentVersionQuery = `
        INSERT INTO document_versions (document_id, version_number, content)
        VALUES ($1, $2, $3);
    `;
    const values = [title, content, creatorId, lastUpdateAuthorId];

    const documentResult = await pool.query(query, values);
    const createdDocument = documentResult.rows[0];
    const documentVersionValues = [createdDocument.document_id, 1, content];
    await pool.query(documentVersionQuery, documentVersionValues);
    ctx.status = 201;
    ctx.body = { message: "Document created successfully" };
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: "Error creating document" };
    console.log("Error", error);
  }
};

/**
 * create a draft documentt from the original document
 * provide version number
 */
export const createDraftDocument = async (ctx: Context) => {
  try {
    const { version_number } = ctx.request.body as Partial<DocumentVersion>;

    const document_id = ctx.params.id;

    const query = `SELECT * FROM document
      WHERE document_id = $1;
      `;

    if (!version_number) {
      ctx.status = 400;
      ctx.body = { message: "Document version is requiured" };
      return;
    }

    const values = [document_id];
    const documentResult = await pool.query(query, values);
    const document = documentResult.rows[0];

    const documentVersionQuery = `
        INSERT INTO document_versions (document_id, version_number, content)
        VALUES ($1, $2, $3);
`;

    const documentVersionValues = [
      document.document_id,
      version_number,
      document.content,
    ];

    ctx.status = 201;
    ctx.body = { message: "Draft document created successfully" };

    await pool.query(documentVersionQuery, documentVersionValues);
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: "Error creating draft document" };
    console.log("Error", error);
  }
};

/**
 * Edit draft document
 * provide lock mechanism to handle concurrency
 * */
export const editDraftDocument = async (ctx: Context) => {
  try {
    const { content } = ctx.request.body as Partial<DocumentVersion>;

    const docId = ctx.params.id;

    const query = `
        UPDATE document_versions
        SET content = $1
        WHERE id = $2;    
    `;

    const values = [content, docId];

    await pool.query(query, values);
    ctx.status = 200;
    ctx.body = { message: "Draft document updated successfully" };
  } catch (error) {
    ctx.body = { message: "Error updating draft document" };
    console.log("Error", error);
  }
};

/**
 * Publish draft document
 * */
export const publishDraft = async (ctx: Context) => {
  try {
    const docId = ctx.params.id;

    const documentVersionQuery = `SELECT * FROM document_versions
       WHERE id = $1;
   `;

    const documentVersionResult = await pool.query(documentVersionQuery, [
      docId,
    ]);

    const documentVersion = documentVersionResult.rows[0];

    const query = `
        UPDATE Document
        SET content = $1,
            status = $2
        WHERE document_id = $3;    
    `;

    const values = [
      documentVersion.content,
      "published",
      documentVersion.document_id,
    ];

    await pool.query(query, values);
    ctx.status = 200;
    ctx.body = { message: "Draft document published successfully" };
  } catch (error) {
    ctx.body = { message: "Error publishing draft document" };
    console.log("Error", error);
  }
};

export const documentHistory = async (ctx: Context) => {
  try {
    const docId = ctx.params.id;
    const query = `SELECT * FROM document_versions
    WHERE document_id = $1;
    `;

    const queryResult = await pool.query(query, [docId]);
    const documentVersions = queryResult.rows;
    ctx.body = documentVersions;
    ctx.status = 200;
  } catch (error) {
    ctx.body = { message: "Error viewing  doc" };
    console.log("Error", error);
  }
};
