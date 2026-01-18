import { NextFunction, Request, Response } from 'express';
import { ZodObject, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

export const validateRequest = (schema: ZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new AppError({
            message: 'Invalid request payload.',
            statusCode: 400,
            code: 'VALIDATION_ERROR',
            metadata: error.flatten()
          })
        );
        return;
      }
      next(error);
    }
  };
