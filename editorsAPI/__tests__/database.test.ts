import { pool } from "../src/config";

describe("Database connection test", () => {
  afterAll(async () => {
    await pool.end();
  });

  it("Connection to db", async () => {
    let client;
    try {
      client = await pool.connect();
      expect(client).toBeDefined();
    } catch (error) {
      fail(error);
    } finally {
      if (client) {
        client.release();
      }
    }
  });
});
