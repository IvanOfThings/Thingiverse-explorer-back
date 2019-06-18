/*=========================================
We do not do any test as the project is small and there is no more time but maybe I'll add them in future days

import 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import Server from '../server';

describe('Things', () => {
  it('should get all examples', () =>
    request(Server)
      .get('/api/v1/things/callback?code=')
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an('array')
          .of.length(2);
      }));

  it('should get all examples', () =>
    request(Server)
      .get('/api/v1/things/list/newest?access_token=')
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an('array')
          .of.length(2);
      }));

  it('should add a new example', () =>
    request(Server)
      .post('/api/v1/things/things/123455')
      .send({ name: 'test' })
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('name')
          .equal('test');
      }));

});
*/