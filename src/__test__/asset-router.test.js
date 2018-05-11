'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';

import { pRemoveAssetMock, pCreateAssetMock } from './lib/asset-mock';
import { mock } from 'sinon';
// import { pCreateAccountMock } from './lib/account-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES AT /assets', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveAssetMock);

  describe('POST  200 for a succesful post to /assets', () => {
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
  describe('POST  400 for Bad Request', () => {
    test('should return a 400', () => {
      // if you have a slow computer you can set a TimeOut function 
      // jest.setTimeout(10000); 
      // const accountMock = null;
      // return pCreateAssetMock()
      //   .then((mockResponse) => {
      //     const { token } = mockResponse.accountMock; // destructuring! see profile-mock at similar line numbers
      //     return superagent.post(`${apiURL}/assets`)
      //       .set('Authorization', `Bearer ${token}`)
      //       .field('title', 'titletestvalue')
      //       .attach('asset', `${__dirname}/assets/asset_test.JPG`)
      //       .then((response) => {
      //         expect(response.status).toEqual(200);
      //         expect(response.body.title).toEqual('titletestvalue');
      //         expect(response.body._id).toBeTruthy();
      //         expect(response.body.url).toBeTruthy();
      //       });
      //   })
      //   .catch((err) => {
      //     console.log('what happened', err);
      //     expect(err.status).toEqual(200);
      //     // create an assertation here that you know will fail to avoid an accidental false positive-- to expect == auto pass
      //     // err is a huge object.  you could logger it, you woud want to json.stringify()... but its huuuuuge
      //   });
    });
  });
  describe('POST  401 for no Token', () => {
    test('should return a 401', () => {
      // const accountMock = null;
      return pCreateAssetMock()
        .then((mockResponse) => {
          // const { token } = mockResponse.accountMock; // destructuring! see profile-mock at similar line numbers
          return superagent.post(`${apiURL}/assets`)
            .set('Authorization', 'Bearer ')
            .field('title', 'titletestvalue')
            .attach('asset', `${__dirname}/assets/asset_test.JPG`)
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(401);      
            });
        });
    });
  });
  describe('GET  200 for a succesful get from /assets', () => {
    test('should return a 200', () => {
      // if you have a slow computer you can set a TimeOut function 
      // jest.setTimeout(10000); 
      let testMock = null;
      return pCreateAssetMock()
        .then((mockResponse) => {
          testMock = mockResponse.asset;
          const { token } = mockResponse.accountMock;// destructuring! see profile-mock at similar line numbers, now token has the value at the simlarly named thing on accountMock, mockResponse.accoutMock, or mockResponse.asset
          return superagent.get(`${apiURL}/assets/${testMock._id}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual(testMock.title);
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
  describe('GET  404 for Bad ID/ no resource', () => {
    test('should return a 404', () => {
      // if you have a slow computer you can set a TimeOut function 
      // jest.setTimeout(10000); 
      let testMock = null;
      return pCreateAssetMock()
        .then((mockResponse) => {
          testMock = mockResponse.asset;
          const { token } = mockResponse.accountMock;// destructuring! see profile-mock at similar line numbers, now token has the value at the simlarly named thing on accountMock, mockResponse.accoutMock, or mockResponse.asset
          return superagent.get(`${apiURL}/assets/BAD_ID`)
            .set('Authorization', `Bearer ${token}`)
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(404);
            });
        });
    });
  });
  describe('GET  401 for no token', () => {
    test('should return a 401', () => {
      // if you have a slow computer you can set a TimeOut function 
      // jest.setTimeout(10000); 
      let testMock = null;
      return pCreateAssetMock()
        .then((mockResponse) => {
          testMock = mockResponse.asset;
          const { token } = mockResponse.accountMock;// destructuring! see profile-mock at similar line numbers, now token has the value at the simlarly named thing on accountMock, mockResponse.accoutMock, or mockResponse.asset
          return superagent.get(`${apiURL}/assets/${testMock._id}`)
            .set('Authorization', `Bearer `)
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(401);
            });
        });
    });
  });
  describe('DELETE 204 for successful delete!', () => {
    test('should return 204', () => {
      // if you have a slow computer you can set a TimeOut function 
      // jest.setTimeout(10000); 
      let testMock = null;
      return pCreateAssetMock()
        .then((mockResponse) => {
          testMock = mockResponse.asset;
          const { token } = mockResponse.accountMock;// destructuring! see profile-mock at similar line numbers, now token has the value at the simlarly named thing on accountMock, mockResponse.accoutMock, or mockResponse.asset
          return superagent.delete(`${apiURL}/assets/${testMock._id}`)
            .set('Authorization', `Bearer ${token}`)
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(401);
            });
        });
    });
  });
});
