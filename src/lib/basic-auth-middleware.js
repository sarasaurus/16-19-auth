'use strict';

import HttpError from 'http-errors';
import Account from '../model/account';

export default (request, response, next) => {

  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH BASIC - no header invalid request!'));
  }
  const base64AuthHeader = request.headers.authorization.split('Basic ')[1];
  if (!base64AuthHeader) {
    return next(new HttpError(400, 'AUTH BASIC - header no split invalid request'));
  }
  // the head is returned in base64 encoding, in line 16 we are converting from base64--- this is not about security, just faster transport, the buffer.from method is just about translating between different kinds of data-- 'base 64' tells the buffer.from method what encoding the file is in so it can convert it to hex or utf8? and then .tostring can convert it to a string
  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  // stringAuthHeader should now look like username:password
  const [username, password] = stringAuthHeader.split(':'); // this is ES6 syntax saying assign 0 and 1 index of array to 0,1 index of const []... this is array destructuring!
  if (!username || !password) {
    return next(new Error(400, 'AUTH BASIC - no user or password invalid request'));
  }
  // now have username and password, so now need to find account and login
  return Account.findOne({ username })
    .then((account) => {
      if (!account) {
        return next(new HttpError(404, 'no such account'))// if want to be vague tho can send 400, cause we sneaky in passwords)
      }
      return account.pVerifyPassword(password);
    })
    .then((account) => {
      request.account = account; // <-- mutating the request object and adding an account property to it, so now can acess
      return next(); // moving down the middle ware chain to our router get route-- now is send to the request, where our request object has a new property 'account', with our account info
      // you could also do your error handling here, up to you where you want to handle, in some ways we already are handling it here... in the previous block
    })
    .catch(next);
// so now have just the base64 info with username:password
};

