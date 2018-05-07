'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import errorMiddleWare from './error-middleware';
import authRouter from '../route/auth-router';



const app = express();
let server = null;
//---------------------------
// 404 should be last because these are read in order:
app.use(authRouter);
app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
});
//-----------------------------
app.use(errorMiddleWare);
//-----------------------------
const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server is listening on port ${process.env.PORT}------------------------------------`);
      });
    })
    .catch((err) => {
      logger.log(logger.ERROR, `something happened in server, ${JSON.stringify(err)}`);
    }); // you could chain a .catch here for any errors, judy says unlikely, but if want to be robust can
};

const stopServer = () => {
  // mongoose.diconnect returns a promise, so needs a .then
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is off------------------------------------');
      });
    });
};

export { startServer, stopServer };
