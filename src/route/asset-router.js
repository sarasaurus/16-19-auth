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

// FRI-NOTES -- multerUpload.any() is currying and passing req,res,next....
// everytimes we pass a function in as middlware it is an ACTUAL FUNCITON INVOCATION and will be invoked with req,res,next, so this .post() takes in request response, first to assets, then to bearerAuthMiddleare(req,res,next)--> resolves like a giant promise and returns the result to the next in the chain, multer.any(req,res,next) etc

assetRouter.post('/assets', bearerAuthMiddleware, multerUpload.any(), (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(404, 'ASSET ROUTER ERROR: asset not found, no account! '));
  }
  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'asset') {
    return next(new HttpError(400, 'ASSET ROUTER ERROR: invalid request'));
  }
  // multer is attaching a files property to our request object and adding the meta data for our 'file' as it exists in our local directory including, a unique filename, absolute path, encoding info, which helps when we upload to a database

  // console.log('WHATS MULTER: ', request.files);

  const [file] = request.files;
  const key = `${file.filename}.${file.originalname}`;

  // file.path is the local absolute path, which in s3.js the s3Upload takes in and passes to fs.remove(path)---> we are using fs-extra as a wrapper to transform the vanilla fs.functions into a streamlined AND promisified .remove method.

  return s3Upload(file.path, key)
    .then((url) => {
      return new Asset({
        title: request.body.title,
        account: request.account._id,
        url,
      }).save()
        .then(asset => response.json(asset))
        .catch((err) => {
          return next;
        });
    });
});
assetRouter.get('/assets/:id', bearerAuthMiddleware, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(404, 'ASSET ROUTER GET ERROR: asset not found, no account! '));
  }
  if (!request.params.id) {
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
  if (!request.account) {
    return next(new HttpError(404, 'ASSET ROUTER GET ERROR: asset not found, no account! '));
  }
  if (!request.params.id) {
    return next(new HttpError(404, 'ASSET ROUTER DELETE ERROR: no params  _id'));
  }
  return Asset.findByIdAndRemove(request.params.id)
    .then((asset) => {
      if (!asset) {
        return next(new HttpError(401, 'ASSET in DELETE route id, but no resource!'));
      }
      logger.log(logger.INFO, '204 in ASSET DELETE route!');
      return s3Remove(asset.url);
    })
    .then(() => {
      return response.sendStatus(204);
    })
    .catch(next);
});

export default assetRouter;
