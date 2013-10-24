var should = require('chai').should(),
    init_tmp = require('../lib/init_tmp'),
    rimraf = require('rimraf'), //rm -rf equivalent
    fs = require('fs');

describe('init_tmp', function(){
  before(function(done){
    rimraf('./.tmp', function(err) {
      if (err) {
        console.log('an error occured while removing ./.tmp: '+err);
      }
      done(err);
    });
  });

  beforeEach(function(done){
    init_tmp(done);
  });

  describe('first run', function(){
    it('should have created ./.tmp/fetch_upload_s3', function(done){
      fs.exists('./.tmp/fetch_upload_s3', function(exists){
        exists.should.be.true;
        done();
      });
    });
  });

  describe('second run', function(){
    it('it should not timeout', function(done){
      fs.exists('./.tmp/fetch_upload_s3', function(exists){
        exists.should.be.true;
        done();
      });
    });
  });

});
