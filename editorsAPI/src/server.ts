import app from "./app";
import { config } from "./config";

const PORT = config.port;

export const server = app.listen(PORT, async () => {
  console.log(`Server running on ${PORT}`);
});
