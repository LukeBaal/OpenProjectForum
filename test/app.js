process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const User = require('../models/User');
const Project = require('../models/Project');
const Post = require('../models/Post');

const server = require('../app');

User.sync({
  force: true
});
Project.sync({
  force: true
});
Post.sync({
  force: true
});

describe('GET /', () => {
  it('should get home route', done => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('text/html');
        res.text.should.contain('Open Source Project Viewer');
        res.text.should.contain('Connect');
        done();
      });
  });
});