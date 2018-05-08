'use strict';

// cap A in Authorization is REQUIRED -- PRO TIP
// 'Authorization: Bearer <token>' STANDARD for send ing TOKENS regardles of language
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';

import { pRemoveProfileMock } from './lib/profile-mock';
import { pCreateAccountMock } from './lib/account-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('POST /profiles', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveProfileMock);

  test.only('POST /profiles should get a 200 if there aree no errors', () => {
    let accountMock = null;
    return pCreateAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiURL}/profiles`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            bio: 'I so coool',
            firstName: 'testbro',
            lastName: 'lastnamebro',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.lastName).toEqual('lastnamebro');
        expect(response.body.firstName).toEqual('testbro');
      });
  });
});
