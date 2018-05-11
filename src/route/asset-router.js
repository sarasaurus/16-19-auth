'use strict';

import multer from 'multer';

import { Router } from 'express';
import HttpError from 'http-errors';
import bodyParser from 'body-parser';
import Asset from '../model/asset';
import logger from '../lib/logger';
import { s3Upload, s3Remove } from '../lib/s3';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';

const multerUpload = multer({ dest: `${__dirname}/../temp` });
const assetRouter = new Router();

assetRouter.post('/assets', bearerAuthMiddleware, multerUpload.any(), (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(404, 'ASSET ROUTER ERROR: asset not found, no account! '));
  }
  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'asset') {
    return next(new HttpError(400, 'ASSET ROUTER ERROR: invalid request'));
  }
  // const file = request.files[0];
  console.log('in asset route, first then request: ', request.files);
  const [file] = request.files;
  const key = `${file.filename}.${file.originalname}`;

  // url is being destructered same as url: url
  return s3Upload(file.path, key)
    .then((url) => {
      console.log('post route in amazon then block', url);
      return new Asset({
        title: request.body.title,
        account: request.account._id,
        url,
      }).save()
        .then(asset => response.json(asset))
        .catch((err) => {
          console.log('asset router err', err.status);
          return next;
        });
    });
});
assetRouter.get('/assets/:id', bearerAuthMiddleware, (request, response, next) => {
  // if(!request.account) {
  //   return next(new HttpError(404, 'ASSET ROUTER GET ERROR: asset not found, no account! '));
  // }
  if (!request.params.id) {
    console.log('REQUEST IN GET:', request);
    return next(new HttpError(404, 'ASSET ROUTER GET ERROR: no params  _id'));
  }
  return Asset.findById(request.params.id)
    .then((asset) => {
      if (!asset) {
        return next(new HttpError(401, 'ASSET in GET- profile route id, but no resource!'));
      }
      logger.log(logger.INFO, '200 in profile, GET route!');
      return response.json(asset);
    })
    .catch(next);
});
assetRouter.delete('/assets/:id', bearerAuthMiddleware, (request, response, next) => {
  // if(!request.account) {
  //   return next(new HttpError(404, 'ASSET ROUTER GET ERROR: asset not found, no account! '));
  // }
  if (!request.params.id) {
    console.log('REQUEST IN DELETE:', request);
    return next(new HttpError(404, 'ASSET ROUTER DELETE ERROR: no params  _id'));
  }
  return Asset.findById(request.params.id)
    .then((asset) => {
      if (!asset) {
        return next(new HttpError(401, 'ASSET in DELETE profile route id, but no resource!'));
      }
      logger.log(logger.INFO, '200 in profile, DELETE route!');
      
      return response.json(asset);
    })
    .catch(next);
});

export default assetRouter;