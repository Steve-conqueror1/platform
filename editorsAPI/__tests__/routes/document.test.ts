import request from "supertest";
import { server } from "../../src/server";
import { describe } from "node:test";
import { pool } from "../../src/config";

describe("Documents API", () => {
  afterEach((done) => {
    server.close();
    done();
  });

  beforeAll(async () => {
    const queryText = `CREATE TABLE Document(
      document_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      creator_id INTEGER,
      updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_update_author_id INTEGER,
      status VARCHAR(20) DEFAULT 'draft'
  )`;

    const documentVersionQueryText = `
      CREATE TABLE document_versions (
      id SERIAL PRIMARY KEY,
      document_id INTEGER NOT NULL,
      version_number INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_document_id FOREIGN KEY (document_id) REFERENCES document(document_id)
);`;

    await pool.query(queryText);
    await pool.query(documentVersionQueryText);
  });

  afterAll(async () => {
    const queryText = `DROP TABLE Document`;
    const versionQueryText = `DROP TABLE document_versions`;
    await pool.query(versionQueryText);
    await pool.query(queryText);
    pool.end();
  });

  it("POST /api/documents", async () => {
    const newDocument = {
      title: "Test document title",
      content: "Test document content",
      version: 1,
    };
    const response = await request(server)
      .post("/api/documents")
      .send(newDocument);
    expect(response.status).toEqual(201);
    expect(response.type).toEqual("application/json");
    expect(response.body).toEqual({ message: "Document created successfully" });
  });

  it("PUT /api/documents/:id", async () => {
    const editDocument = {
      title: "Edited document title",
      content: "Edited document content",
    };

    const selectQuery = "SELECT * FROM Document ORDER BY document_id LIMIT 1";
    const result = await pool.query(selectQuery);
    const firstDocument = result.rows[0];

    const response = await request(server)
      .put(`/api/documents/${firstDocument.document_id}`)
      .send(editDocument);

    const selectQueryEdited =
      "SELECT * FROM Document ORDER BY document_id LIMIT 1";
    const resultEdited = await pool.query(selectQueryEdited);
    const firstDocumentEdited = resultEdited.rows[0];

    expect(response.status).toEqual(200);
    expect(response.type).toEqual("application/json");

    expect(response.body).toEqual({
      message: "Document updated successfully",
    });
    expect(editDocument.title).toEqual(firstDocumentEdited.title);
    expect(editDocument.content).toEqual(firstDocumentEdited.content);
  });
});
