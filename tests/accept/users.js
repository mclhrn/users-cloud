const logger = require('winston');
const server = require('../../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const seed = require('../../seed/seed');
const User = require('../../models/user');
const expect = require('chai').expect;

chai.should();
chai.use(chaiHttp);

const url = 'http://127.0.0.1:8001';


describe('Users', () => {

  // Before our test suite
  before((done) => {
    // Start our app on an alternative port for acceptance tests
    server.listen(8001, () => {
      logger.info('Listening at http://localhost:8001 for acceptance tests');
      // Seed the DB with our users
      seed((err) => {
        done(err);
      });
    });
  });

  describe('/GET users', () => {
    it('should return a list of users', (done) => {
      chai.request(url)
        .get('/api/v1/users')
        .end((err, res) => {
          res.body.should.be.a('array');
          res.should.have.status(200);
          res.body.length.should.be.eql(100);
          done();
        });
    });
  });

  describe('/GET users/:id', () => {
    it('should return a single user', (done) => {
      // Find a user in the DB
      User.findOne({}, (err, user) => {

        const id = user._id;

        // Read this user by id
        chai.request(url)
          .get('/api/v1/user/' + id)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body.name.first).to.be.a('string');
            done();
          });
      });
    });
  });

  describe('/POST users', function () {
    const u = {
      gender: 'female',
      name: {
        title: 'Mrs',
        first: 'Wonder',
        last: 'Woman'
      },
      location: {
        street: '',
        city: '',
        state: '',
        zip: ''
      },
      email: '',
      username: '',
      password: '',
      registered: '',
      dob: '',
      phone: '',
      cell: '',
      PPS: '',
      picture: {
        large: '',
        medium: '',
        thumbnail: ''
      }
    };
    it('should create a new user', function (done) {
      chai.request(url)
        .post('/api/v1/user/')
        .send(u)
        .end(function (err, res) {
          res.body.should.be.a('object');
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/DELETE /api/v1/user/:id', function () {
    it('should delete a single user', function (done) {
      // Delete a user from the DB
      User.findOne({}, function (err, user) {
        const id = user._id;
        // Delete this user by id
        chai.request(url)
          .delete('/api/v1/user/' + id)
          .end(function (err, res) {
            res.should.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body.result).to.be.a('boolean');
            done();
          });
      });
    });
  });

});
