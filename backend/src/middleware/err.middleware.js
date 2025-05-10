export const NotFoundMiddleware = (req, res) => {
    res.status(404).json({
      success: false,
      status: 404,
      message: "Resource not found",
    });
  };
  
  export const GlobalErrorMiddleware = (err, req, res, next) => {
    if (!err) {
      return next();
    }
  
    console.error(`[ERROR]: Error on path: ${req._parsedUrl.pathname}`);
    console.error("[Runtime Error]:", err);
  
    const statusCode = err.statusCode || 500; // Set statusCode from error, default to 500
    const errorMessage =
      err.message || "An unknown error occurred on the server. Try again later.";
  
    res.status(statusCode).json({
      success: false,
      status: statusCode,
      message: errorMessage,
    });
  };
  