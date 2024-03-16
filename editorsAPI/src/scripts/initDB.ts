import { pool } from "../config";

const initDB = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const queryText = `CREATE TABLE Document(
            document_id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            creator_id INTEGER NOT NULL,
            updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_update_author_id INTEGER NOT NULL,
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

    await client.query(queryText);
    await client.query(documentVersionQueryText);
    await client.query("COMMIT");
    console.log("DB successfully initialized");
  } catch (e) {
    await client.query("ROLLBACK");
    console.log("Error initializing DB", e);
  } finally {
    client.release();
  }
};

initDB();
