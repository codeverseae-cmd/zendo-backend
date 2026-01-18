import { NextFunction, Request, Response } from 'express';
import { AppError, isAppError } from '../utils/AppError';
import logger from '../config/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const appError = isAppError(err)
    ? err
    : new AppError({
        message: err.message || 'Unexpected error occurred.',
        statusCode: 500
      });

  const responsePayload = {
    success: false,
    error: {
      code: appError.code,
      message: appError.message,
      metadata: appError.metadata
    }
  };

  logger.error(
    {
      err: appError,
      code: appError.code,
      statusCode: appError.statusCode,
      metadata: appError.metadata
    },
    appError.message
  );

  if (res.headersSent) {
    return res.end();
  }

  return res.status(appError.statusCode).json(responsePayload);
};
