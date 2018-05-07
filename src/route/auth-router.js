'use strict';

import { Router } from 'express';
// destructuring Router from express, its a constructor inside express, but destructuring can access any property--funcitons, objects whatever
// think desstructuring and module... the express module
import bodyParser from 'body-parser';
import HttpError from 'http-errors';
import Account from '../model/account';
import logger from '../lib/logger'


const jsonParser = bodyParser.json();// if can would be preferable to use desctructuring for this like { json() }, but would still have to assign it to a variable for express to be happy

const authRouter = new Router();

authRouter.post('/signup', jsonParser, (request, response, next) => {
// in the req we have a username, email and password; 1st step must 1.1 hash and 1.2 remove password
// so need write a new function to do those two steps
// makes sense to tie this function to hash and remove to the SCHEMA, not the auth router
  return Account.create(request.body.username, request.body.email, request.body.password)
    .then((account) => {
      delete request.body.password; // as early as possible we want to get rid of password typically no want to use in objects because it removes key AAAND value, its easy to remove more than you want--- sometimes better just set = null

      logger.log(logger.INFO, 'AUTH - creating TOKEN');
      return account.pCreateToken();
    })
    .then((token) => {
      logger.log(logger.INFO, 'AUTH - returning a 200 code and a token');
      return response.json({ token });
    })
    .catch(next);
});


export default authRouter;

