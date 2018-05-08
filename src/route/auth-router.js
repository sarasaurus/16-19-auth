'use strict';

import { Router } from 'express';

import bodyParser from 'body-parser';
import Account from '../model/account';
import logger from '../lib/logger';


const jsonParser = bodyParser.json();
const authRouter = new Router();

authRouter.post('/signup', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Account.create(request.body.username, request.body.email, request.body.password, options)
    .then((account) => {
      delete request.body.password;
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

