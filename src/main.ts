import 'dotenv/config'
import { app } from "./app/app";
import cors from 'cors';
import { consoleLogger, fileLogger } from "./app/logging";
import express, { Request, Response } from "express";

import { errorMiddleware } from "./middleware/error-middleware";
import { logRequestMiddleware } from "./middleware/request-middleware";
import { routes } from "./controller/routes";
import { temanhealingDB, usermanagementDB } from './app/database';
import cookieParser from 'cookie-parser'
import path from 'path'
import {memcached} from "./config/memcached"
import {redis} from "./config/redis"

const port = process.env.PORT

app.locals.memcached = memcached;
app.locals.redis = redis;


app.use(cors({
  // credentials: true,
  // origin: process.env.ALLOWED_CORS?.split(',')

  origin:'*' //sementara dibuat wildcard dulu
}))



app.use(cookieParser())
app.use('/public', express.static(path.join(__dirname, '../public')));


app.use(logRequestMiddleware)


app.use('/', routes)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/templates')); // Folder tempat EJS
app.get('/debug-tamplates', (req, res) => {
  const data = {
      name: 'John Doe',
      email: 'john@example.com',
      otp:'123456',
      link:'http://example.com'
  };

  // Render file otp.ejs dan kirim ke browser
  res.render('newuser', data);
});


app.use(errorMiddleware)
app.get('*splat', function (req: Request, res: Response) {
  res.status(404).send('<html><head><title>Dashboard API X II</title></head><body><h1>Hello, Syntera disini!</h1></body></html>')
})

temanhealingDB.authenticate()
.then(()=>{
  consoleLogger.info('\x1b[43mConnected to the database\x1b[0m');
})
.catch((error)=>{
  consoleLogger.info('Unable to connect to the database:', error);
})

app.listen(port, () => {
  fileLogger.info(`Dashboard API X II - Listening on port : ${port}`)
  consoleLogger.info(`\x1b[43mAUTH API X II - Listening on port : ${port} \x1b[0m`)
})

export const main = app