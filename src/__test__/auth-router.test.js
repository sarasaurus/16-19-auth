'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pRemoveAccountMock, pCreateAccountMock } from './lib/account-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('AUTH Router', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveAccountMock);

  test('POST should return a 200 status code and a TOKEN', () => {
    return superagent.post(`${apiURL}/signup`)
      .send({
        username: 'gregor',
        email: 'gregar@gregor.com',
        password: 'supersekret',
      })
      .then((response) => {
        console.log('RESPONSE: ', response.body);
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
  test('POST should return a 400 status code, bad request', () => {
    return superagent.post(`${apiURL}/signup`)
      .send({
        username: '',
        email: '',
        password: '',
      })
      .then((Promise.reject))
      .catch((err) => {
        console.log('RESPONSE: ', err);
        expect(err.status).toEqual(400);
      });
  });

  test('POST should return a 409 status code, no duplicates', () => {
    return superagent.post(`${apiURL}/signup`)
      .send({
        username: 'gregor',
        email: 'gregar@gregor.com',
        password: 'supersekret',
      })
      .then(() => {
        return superagent.post(`${apiURL}/signup`)
          .send({
            username: 'gregor',
            email: 'gregar@gregor.com',
            password: 'supersekret',
          })
          .then((Promise.reject))
          .catch((err) => {
            console.log('409 ERROR: ', err.body);
            expect(err.status).toEqual(409);
          });
      });
  });
  test('GET /login', () => {
    return pCreateAccountMock()
      .then((mock) => {
        return superagent.get(`${apiURL}/login`)
          .auth(mock.request.username, mock.request.password);// this is IMPORTANT, .auth is a superagent method to send usernames and passwords
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
});

