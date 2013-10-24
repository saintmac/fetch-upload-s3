var should = require('chai').should(),
    S3Bucket = require('../lib/bucket'),
    fs = require('fs'),
    FUS3 = require('../');

describe('fetch and upload to S3', function() {
  before(function(done){
    this.bucket_name = 'test-node-fetch-and-upload-s3';
    this.fus3 = new FUS3(this.bucket_name);
    this.fus3.init(done);
    this.testing_bucket = new S3Bucket(this.bucket_name);
  });

  describe('init', function() {
    it('should have created .tmp/fetch_upload_s3', function(done){
      fs.exists('./.tmp/fetch_upload_s3', function(exists){
        exists.should.be.true;
        done();
      });
    });

    it('should have created the bucket', function(done){
      this.testing_bucket.exists(function(exists){
        exists.should.be.true;
        done();
      });
    });
  });

  describe('do', function(){
    before(function(done){
      this.s3_key = 'node_logo.png';
      this.fus3.do('http://nodejs.org/images/logo.png', this.bucket_name, this.s3_key, done);
    });

    it('should put the file in S3', function(done){
      this.testing_bucket.file_exists(this.s3_key, function(exists){
        exists.should.be.true;
        done();
      });
    });

    after(function(done){
      this.testing_bucket.file_delete(this.s3_key, done);
    });
  });











  after(function(done){
    this.testing_bucket.delete(done);
  });
});