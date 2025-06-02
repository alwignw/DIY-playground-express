import { Response, Request, NextFunction, } from 'express';
import { ResponseError } from '../error/response-error';

export const headerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req.headers.authorization){
      throw new ResponseError(400, 'Authentication Required')
    }
    return next();
  } catch (error) {next(error)}
}