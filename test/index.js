var chai = require('chai')
var chaiHttp = require('chai-http');
var should = chai.should();

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

// describe('Getting', function() {
//   it('should be able to post', function (done) {
//       chai.request('localhost:3000')
//       .get('/shows')
//       .send({title: "Test", comment:[{words: "blah"}]})
//       .end(function (err, res){
//           if (err) done(err);
//           res.body.should.have.property(title);
//           res.body.title.should.have.property('Test');
//           done();
//       });
//   });
// });
