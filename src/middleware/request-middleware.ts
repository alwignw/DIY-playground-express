import { Response, Request, NextFunction, } from 'express';
import { fileLogger } from '../app/logging';
// import { Repository } from '../model/repository';
export const logRequestMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const log = {
    url: req.url,
    headers: req.headers,
    body: req.body,
    query: req.query,
    params: req.params,
  }
  fileLogger.info(JSON.stringify({ logName: "request", ...log }))

  // await Repository.ApiLogModel.create({
  //   payload: JSON.stringify({...req.body,...req.query}),
  //   path: req.path,
  //   header: JSON.stringify({...req.headers}),
  //   type:'request',
  //   user_agent: req.headers["user-agent"]
  // })

  next()
}