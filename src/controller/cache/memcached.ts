

import { Response, NextFunction, Request } from "express";



const bigData_get = [
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            //check cached
            const cached = await req.app.locals.memcached.get('user:1:test')
            console.log(cached)
            res.status(200).json({data:'sukses'})
        } catch (error) {
            next(error);
        }
    }
]

export default {
    'big-data' : bigData_get
}