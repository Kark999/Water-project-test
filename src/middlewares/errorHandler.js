import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof createHttpError.HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      errors: err.errors || [],
    });
    next();
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    errors: err.message,
  });
};
