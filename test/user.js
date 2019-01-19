process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const server = require('../app');

const register_details = {
  username: 'john',
  password: 123,
  password2: 123,
  email: 'john@gmail.com'
};

const login_details = {
  username: 'john',
  password: 123
};

describe('GET /user/register', () => {
  it('should get registration form', done => {
    chai
      .request(server)
      .get('/user/register')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('text/html');
        res.text.should.contain('Register');
        res.text.should.contain('username');
        done();
      });
  });
});

describe('POST /user/register', () => {
  it('should register given user', done => {
    chai
      .request(server)
      .post('/user/register')
      .type('form')
      .send(register_details)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        expect('Location', '/user/login');
        done();
      });
  });
});

describe('GET /user/login', () => {
  it('should get login page', done => {
    chai
      .request(server)
      .get('/user/login')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.text.should.contain('Login');
        res.text.should.contain('username');
        done();
      });
  });
});

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

// describe('Login then get profile', () => {
//   beforeEach(done => {
//     chai
//       .request(server)
//       .post('/user/login')
//       .type('form')
//       .send(login_details)
//       .end((err, res) => {
//         should.not.exist(err);
//         res.status.should.equal(200);
//         expect('Location', `/user/profile/${login_details.username}`);
//         done();
//       });
//   });
//   describe('GET /user/profile/:username', () => {
//     it('should get profile page', done => {
//       chai
//         .request(server)
//         .get(`/user/profile/${login_details.username}`)
//         .end((err, res) => {
//           should.not.exist(err);
//           res.status.should.equal(200);
//           expect('Location', `/user/profile/${login_details.username}`);
//           done();
//         });
//     });
//   });
// });

describe('GET /user/profile/:username', () => {
  it('should get profile page', done => {
    chai
      .request(server)
      .get(`/user/profile/${login_details.username}`)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        expect('Location', `/user/profile/${login_details.username}`);
        done();
      });
  });
});
