var chai = require('chai')
var chaiHttp = require('chai-http');
var should = chai.should();
var request = require("request");
var expect = chai.expect;


var AnimeComment = require('../models/anime.js')


chai.use(chaiHttp);

describe('Site', function() {
  it('should have a live landing page', function (done) {
    chai.request('localhost:3000')
      .get('/')
      .end(function (err, res){
        res.status.should.be.equal(200);
        done();
      });
  });
});

//Create a comment
describe('Response Test', function() {
  it('should be able to send something', function (done) {
      chai.request('localhost:3000')
      .get('/')
      .send({comment: "blablabla"})
      .end(function (err, res){
          res.status.should.be.equal(200);
          res.request._data.should.have.property('comment')
          done()
      });
  });
});

// Let's make sure it can actually get an anime page
describe('Resource: Comments', function() {
  it('should be able create a comment', function (done) {
      request.post({
          url: 'http://localhost:3000/anime/',
          method: 'POST',
          AnimeComment: {
              comment: "Hello there",
              rating: 4,
              kitsuId: 1
          }
      }, function (err, res, body){
          expect(res.statusCode).to.equal(302);
          done();
      })
  })

  it('should be able get comments and load everything', function (done) {
      request.get({
          url: 'http://localhost:3000/anime/1',
          method: 'GET',
          AnimeComment: {}
      }, function (err, res, body){
          expect(res.statusCode).to.equal(200)
          done();
      })
  })

  it('should be able delete a post', function (done) {
      this.timeout(5000)
      request.post({
          url: 'http://localhost:3000/anime/',
          method: 'POST',
          AnimeComment: {
              comment: "Hello there",
              rating: 4,
              kitsuId: 1
          }
      }),
      AnimeComment.find({ comment : "Hello there" }, function(err, comment){
          request.delete({
              url: 'http://localhost:3000/anime/1/' + comment._id,
              method: 'DELETE'
          }, function (err, res, body){

              expect(res.statusCode).to.equal(302)
              done();
          })
      })
  })

})

// describe('Resource: API', function() {
//     it('should be able grab information', function (done) {
//         request.get({
//             url: 'http://localhost:3000/anime/1',
//             method: 'GET',
//         }, function (err, res, body){
//             done();
//         })
//     })
// })
