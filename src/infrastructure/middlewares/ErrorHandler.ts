import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {


  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({ error: 'Validation Error', details: err.message });
    return;
  }

  res.status(500).json({ error: 'Internal Server Error' });
};

export default errorHandler;
