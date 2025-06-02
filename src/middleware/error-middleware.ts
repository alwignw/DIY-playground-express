import { Response, Request, NextFunction, } from 'express';
import { ResponseError } from '../error/response-error';
import { ZodError } from 'zod';
import { consoleLogger } from '../app/logging';
import { Utils } from '../utils/utils';
export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {

  if (error instanceof ResponseError) {
    consoleLogger.info({
      error: error.message,
      errorMessage: error.displayMessage
    })
    console.log({
      error: error.message,
      errorMessage: error.displayMessage
    })
    return res.status(error.status).json({
      error: error.message,
      errorMessage: error.displayMessage
    })
  }
  else if (error instanceof ZodError) {
    consoleLogger.info({
      error: `Validation Error - ${error.issues[0].message}`,
    })
    console.log({
      error: `Validation Error - ${error.issues[0].message}`,
    })
    if(Utils.isJSON(error.issues[0].message)){
      var dataError = JSON.parse(error.issues[0].message)
      return res.status(400).json({
        error: `Validation Error - ${dataError.error}`,
        errorMessage: dataError.errorMessage
      })
    }
    return res.status(400).json({
      error: `Validation Error - ${error.issues[0].message}`,
    })
  }
  consoleLogger.info({
    error: error.message
  })
  console.log({
    error: error
  })
  return res.status(500).json({
    error: error.message
  })
}