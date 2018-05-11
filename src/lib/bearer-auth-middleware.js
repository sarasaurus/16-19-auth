'use strict';

import HttpError from 'http-errors';
// http error is just an error handling wrapper that helps us make errors easily
import jsonWebToken from 'jsonwebtoken';
import Account from '../model/account';

// this process is called currying?
const promisify = callbackStyleFunction => (...args) => {
  // ...args is a spread operator-- it can take a variable number of arguments, and returns an array-like object of them-- but no can use array methods
  // so if in function signature -- it takes many args, if you CALLING function, you then destrcuting whatever is passed in...?
  // Here have two sets of arguments
  // fn -> the function we want to promisify
  // ..args being whatever arguments the fn we passing in takes as arguments/parameters
  return new Promise((resolve, reject) => {
    callbackStyleFunction(...args, (error, data) => {
      if (error) {
        return reject(error);// going to the next .catch
      }
      return resolve(data);
      // going to next .then
    });
    // ...args.. err, data signature of the oldschool error first callbacks of node.js, aws also uses this
  });
};

// you will export this entire thing: no need a nam, because you assign it a name when u import it as middleware
export default (request, response, next) => {
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH BEARER - no headers invalid Response'));
  }
  const token = request.headers.authorization.split('Bearer ')[1];
  // FRI-NOTES -- here we are getting the encrypted token from the header
  // JWT does not support promises yet!! so must use oldschool function--- 
  if (!token) {
    return next(new HttpError(401, 'AUTH BEARER - no token invalid Response'));
  }
  // here jsonWebToken is being based as arg to the callbackSTyleFunction parameter, and then token and process.env are being passed in the the ...args parameter-- these functions are curried, one function rreturns a function, so to call, pass arg to first function, then artgs to second, thus invoking the function it returns(args)(args to  second)

  // FRI-NOTES -- you could cache the first function in a variable and invoke it later, but this promisify wrapper is not actually async, the first function is a blocking function... and must complete for anything else to bump from callstack--- q? does this mean caching is a bad idea? 

  return promisify(jsonWebToken.verify)(token, process.env.SOUND_CLOUD_SECRET)
    .catch((error) => {
      Promise.reject(new HttpError(400, `AUTH BEARER - Json webtoken Error ${error}`));
      // this .catch is the catch from our first function, jsonWebtoken, if that function fails it returns an error, not data to its next function

      // TODO: instead of this .catch you could add this to error-middleware
      // try to avoid thens inside thens-- goal make straight
    })
    .then((decryptedToken) => {
      // FRI-NOTES -- here we are GETing the account matching this tokenSeed, no modification going on, findOne is a mongoose method to query via ONE property
      return Account.findOne({ tokenSeed: decryptedToken.tokenSeed });
    })
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, 'AUTH BEARER - invalid Response'));
      }
      request.account = account;
      return next();
    })
    .catch(next);
};
