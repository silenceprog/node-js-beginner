import express from "express";
import cors from "cors";
import "dotenv/config";
import logger from "pino-http";

import router from "./routes/notesRouts.js";
import { connectToMongoDB } from "./db/connectMongoDB.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import helmet from "helmet";

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(logger());

app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

await connectToMongoDB();

app.listen(PORT || 5000, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
