import { Request, Response, NextFunction } from 'express';

// Simple error handler middleware
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}

// Request logger
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.path}`);
  next();
}

// TODO: Add auth middleware
// FIXME: No authentication at all right now, anyone can access /admin routes
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // const token = req.headers.authorization;
  // if (!token) return res.status(401).json({ error: 'No token provided' });
  // TODO: implement JWT verification
  next();
}

// TODO: Add rate limiting
