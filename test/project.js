process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const server = require('../app');

const login_details = {
  username: 'john',
  password: 123
};

describe('POST /user/login', () => {
  it('should login user', done => {
    chai
      .request(server)
      .post('/user/login')
      .type('form')
      .send(login_details)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        expect('Location', `/user/profile/john`);
        done();
      });
  });
});

describe('GET /projects', () => {
  it('should get projects page', done => {
    chai
      .request(server)
      .get('/projects')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        expect('Location', '/projects');
        // res.text.should.contain('All Projects');
        done();
      });
  });
});
