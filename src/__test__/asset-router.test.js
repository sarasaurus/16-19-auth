'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';

import { pRemoveAssetMock, pCreateAssetMock } from './lib/asset-mock';
// import { pCreateAccountMock } from './lib/account-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES AT /asset', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveAssetMock);

  describe('POST  200 for a succesful post to /asset', () => {
    test('should return a 200', () => {
      // if you have a slow computer you can set a TimeOut function 
      // jest.setTimeout(10000); 

      const accountMock = null;
      return pCreateAssetMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock; // destructuring! see profile-mock at similar line numbers
          return superagent.post(`${apiURL}/assets`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'titletestvalue')
            .attach('asset', `${__dirname}/assets/asset_test.JPG`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('titletestvalue');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        })
        .catch((err) => {
          console.log('what happened', err);
          expect(err.status).toEqual(200);
          // create an assertation here that you know will fail to avoid an accidental false positive-- to expect == auto pass
          // err is a huge object.  you could logger it, you woud want to json.stringify()... but its huuuuuge
        });
    });
  });
});
