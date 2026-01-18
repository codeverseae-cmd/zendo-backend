export type ErrorMetadata = Record<string, unknown> | undefined;

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly metadata?: ErrorMetadata;

  constructor({
    message,
    statusCode = 500,
    code = 'INTERNAL_SERVER_ERROR',
    metadata
  }: {
    message: string;
    statusCode?: number;
    code?: string;
    metadata?: ErrorMetadata;
  }) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.metadata = metadata;
    Error.captureStackTrace?.(this, AppError);
  }
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError;
