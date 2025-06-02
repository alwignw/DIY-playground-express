import { Response, Request, NextFunction, } from 'express';
import { ResponseError } from '../error/response-error';
import jwt from "jsonwebtoken";

export const parseJwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization!
    if (!token.includes('Bearer')) {
      throw new ResponseError(400, `Invalid Token`)
    }
    token = token.replace(/Bearer /g,"")


    function verifyJwtToken(token:string, secret:string) {
      return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        });
      });
    }

    let isVerify = await verifyJwtToken(token,process.env.SECRET_ACCESS_TOKEN??"")
      .then(() => true)
      .catch(() => false);

    if(!isVerify){
      isVerify = await verifyJwtToken(token,process.env.SECRET_REFRESH_TOKEN??"")
      .then(() => true)
      .catch(() => false);
    }

    if(!isVerify){
      throw new ResponseError(403, `JWT Token Invalid`)
    }

    const decoded = jwt.decode(token);
    if(!decoded){
      throw new ResponseError(400, `Invalid Payload`)
    }

    req.body.jwtTokenPayload = decoded
    req.body.jwtToken = token

    return next();
  } catch (error) { next(error) }
}