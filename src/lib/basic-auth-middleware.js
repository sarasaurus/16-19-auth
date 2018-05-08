'use strict';

import Account from '../model/account';
import HttpError from 'http-errors';

export default (request, response, next) => {
/*
1. need to check headers: request.headers.authorization
2. parse the username and password 
    will need to start w base 64 then compare to 'normal' string, split on the colon (colon separates username and password, ie username:password)
3. once parsed, will find the account and login

NOTE: headers is on purpose, there are many headers

*/

  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH - invalid request!'));
  }
  // if here  we know have the authorization header

  const base64AuthHeader = request.headers.authorization.split('Basic ')[1];
  if (!base64AuthHeader) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  // stringAuthHeader should now look like username:password
  const [username, password] = stringAuthHeader.split(':'); // this is ES6 syntax saying assign 0 and 1 index of array to 0,1 index of const []... this is array destructuring!
  if (!username || !password) {
    return next(new Error(400, 'AUTH - invalid request'));
  }
  // now have username and password, so now need to find account and login
  return Account.findOne({ username })
    .then((account) => {
      if (!account) {
        return next(new HttpError(404, 'no such account')) // if want to be vague tho can send 400, cause we sneaky in passwords)
      }
      return account.pVerifyPassword(password);
    })
    .then((account) => {
      request.account = accout; // <-- mutating the request object and adding an account property to it, so now can acess
      return next(); // moving down the middle ware chain

    })
    .catch(next);
// so now have just the base64 info with username:password
};


// typical exprss middlewrae signature is req, res, next
