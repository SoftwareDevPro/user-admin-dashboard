
var request = require('supertest');
var app = require('../app');
var assert = require('assert');
var passwordHash = require('password-hash');


describe('POST /users/delete', function() {
    it('deletes all users', function() {
        return request(app)
          .post('/users/delete')
          .expect('Content-Type', /text\/plain/)
          .expect(302);
    });
});

describe('POST /users/create', function() {
    it('creates a user', function() {
        return request(app)
          .post('/users/create')
          .send({name: 'xyz', pass: '123', 'email': 'abc@gmail.com'})
          .expect('Content-Type', /text\/plain/)
          .expect(302);
  });
});

describe('GET /users', function() {
    it('responds with 1 user', function() {
      return request(app)
        .get('/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(response => response.body.length === 1);
    });
});

describe('POST /users/edit/:userId', function() {
    it('can edit the user', function() {
      return request(app)
      .post('/users/edit/1')
      .send({name: 'aaaaaaxyz', pass: 'aaaaaaxyz', 'email': 'aaaaaaxyz@gmail.com'})
      .expect('Content-Type', /text\/plain; charset=utf-8/)
      .expect(302);
    });
});

describe('GET /users/:userId', function() {
    it('can query the user', function() {
        return request(app)
          .get('/users')
          .query({'userId': 1})
          .expect('Content-Type', 'application/json; charset=utf-8')
          .expect(function(r) {
              // the body is actually an array, turn it into a simple object
              r.body = {
                  name: r.body[0].name,
                  pass: passwordHash.verify('aaaaaaxyz', r.body[0].pass),
                  email: r.body[0].email
              };
          })
          .expect(200, {
              name: 'aaaaaaxyz',
              // the password is stored as a hash, verify using the
              // password hash library 
              pass: true,
              email: 'aaaaaaxyz@gmail.com'
          });
    });
});

describe('POST /users/delete/:userId', function() {
    it('can delete the user', function() {
        return request(app)
          .post('/users/delete')
          .send({userId: 1 })
          .expect('Content-Type', /text\/plain/)
          .expect(302);
    });
});

describe('GET /users', function() {
    it('responds with 0 users', function() {
      return request(app)
        .get('/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {});
    });
});

    
