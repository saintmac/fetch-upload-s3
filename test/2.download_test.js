var should = require('chai').should(),
    download = require('../lib/download'),
    fs = require('fs');


describe('download', function(){
  describe('for a non 200 url', function() {
      it('should return an error', function(done) {
          download('http://www.google.com/images/srpr/logo11.png', '404.png', function(err) {
              should.exist(err);
              done()
          });
      });

      it('should NOT have created the file', function(done) {
          fs.exists('./.tmp/fetch_upload_s3/404.png', function(exists){
              exists.should.be.false;
              done()
          });
      });

  });


  describe('for a 200 url', function() {
      before(function(done){
          download('http://www.google.com/images/srpr/logo11w.png', 'google.png', done);
      });

      it('should have created the file', function(done) {
          fs.exists('./.tmp/fetch_upload_s3/google.png', function(exists){
              exists.should.be.true;
              done()
          });
      });
  });
});
