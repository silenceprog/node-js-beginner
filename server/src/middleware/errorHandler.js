import { isHttpError } from "http-errors";

export const errorHandler = (err, req, res, next) => {
  if (isHttpError(err)) {
    return res.status(err.status).json({ error: err.message });
  }

  const isProduction = process.env.NODE_ENV === "production";

  res.status(500).json({ error: isProduction ? err.message : err.stack });
};
