import { ApiErrors } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiErrors) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: [],
  });
};

export default errorHandler;
