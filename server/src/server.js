import express from "express";
import cors from "cors";
import "dotenv/config";
import logger from "pino-http";
import { readFileSync } from "node:fs";
import swaggerUi from "swagger-ui-express";
import notesRoutes from "./routes/notesRouts.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectToMongoDB } from "./db/connectMongoDB.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import helmet from "helmet";
import { errors } from "celebrate";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT;

const swaggerDocument = JSON.parse(
  readFileSync(new URL("../swagger.json", import.meta.url), "utf8"),
);

const app = express();
app.use(express.json());

app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(helmet());
app.use(logger());

app.use(notesRoutes);
app.use(authRoutes);
app.use(userRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectToMongoDB();

app.listen(PORT || 5000, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
