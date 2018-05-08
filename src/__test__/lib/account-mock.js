'use strict';

import faker from 'faker';
import Account from '../../model/account';

const pCreateAccountMock = () => {
  // we will do this TOMORROW:
  const mock = {};
  mock.request = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.lorem.words(5),
  };
  // here we store REQUEST
  // note the mock.request etc is basically the same as when we set this in our router--- here we are trying to bypass superagent etc so when test in our test file are only testing our router.  here we are doing all the api requests manually essentially
  return Account.create(mock.request.username, mock.request.email, mock.request.password) 
    .then((account) => {
      mock.account = account;
      // ** thats why we have to store here, so after we update the account with pCreate, we will still be able to access it using ._id
      // need access to both the request (with username, email and password) and the actual account w tokenseed and token
      return account.pCreateToken();
      // token seed is now new-- this line changes the account-- ie updates its tokenseed
    })
    .then((token) => {
      // token is the actual token, here we don't have a ref to same account, because the tokenseed has changed-- so to access it again we use it's id**
      mock.token = token;
      // here since above promise has resolved, we know the tokenseed has been updated so need to find the account via the stored id
      return Account.findById(mock.account._id);
      // here we store TOKEN, because the token seed is in the account, but is different from the TOKEN itself
    })
    .then((account) => {
      // here we get account again
      mock.account = account;
      return mock;
    });
};

const pRemoveAccountMock = () => Account.remove({});
export { pRemoveAccountMock, pCreateAccountMock };
