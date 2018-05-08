'use strict';

import { Router } from 'express';
import HttpError from 'http-errors';
import bodyParser from 'body-parser';

import Account from '../model/account';
import logger from '../lib/logger';
import basicAuthMiddleware from '../lib/basic-auth-middleware';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';


const jsonParser = bodyParser.json();
const profileRouter = new Router();

profileRouter.post('/profiles', jsonParser, (request, response, next) => {
  if (!request.account) {
    // TODO: return error
  }
  return profileRouter({
    ...request.body,
    account: request.account._id,
  })
    .save()
    .then((profile) => {
      logger.log(logger.INFO, '200 from new Profile created!');
      return response.json(profile);
    })
    .catch(next);
});

// ...request.body will destructure all the properties! then request.account, grabs the property it wants

export default profileRouter;
