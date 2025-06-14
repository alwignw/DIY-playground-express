

import { Response, NextFunction, Request } from "express";
import {run, chat} from '../../service/rag/chat'



const run_get = [
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            //check cached
            const rest = await run()
            res.status(200).json({data:rest})
        } catch (error) {
            next(error);
        }
    }
]


const _get = [
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const redis = req.app.locals.redis;
            //check cached
            const rest = await chat({redis,...req.query})
            res.status(200).json({data:rest})
        } catch (error) {
            next(error);
        }
    }
]

export default {
    'run_get': run_get,
    'test_get' : _get
}