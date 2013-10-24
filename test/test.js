var should = require('chai').should(),
    download = require('../lib/download'),
    init = require('../lib/init_tmp'),
    S3Bucket = require('../lib/bucket'),
    fs = require('fs'),
    rimraf = require('rimraf'), //rm -rf equivalent
    fetch_upload_s3 = require('../');


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
    init(done);
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

describe('test download', function(){
  before(function(done){
    download('https://npmjs.org/static/npm.png', 'npm_logo.png', done);
  });

  it('should have created the file', function(done) {
    fs.exists('./.tmp/fetch_upload_s3/npm_logo.png', function(exists){
      exists.should.be.true;
      done()
    });
  });
});


describe('writing to S3', function(){
  before(function(done){
    this.bucket_name = 'test-node-fetch-uplod-s3'
    this.s3_bucket = new S3Bucket(this.bucket_name);
    done();
  });

  describe('creating a bucket', function(){
    it('should try to create a non existing bucket', function(done){
      this.s3_bucket.exists(function(exists){
        exists.should.be.false;
        done();
      });
    });

    it('should create the bucket', function(done){
      self = this;
      this.s3_bucket.create(function(){
        self.s3_bucket.exists(function(exists){
          exists.should.be.true;
          done();
        });
      });
    });
  });

  describe('writing objects', function(){
    before(function(done){
      this.s3_key = 'npm_logo.png';
      done();
    });

    describe('uploading to the bucket', function(done){
      before(function(done){
        self.s3_bucket.upload('./.tmp/fetch_upload_s3/npm_logo.png', self.s3_key, done);
      });

      it('should use an existing bucket', function(done){
        this.s3_bucket.exists(function(exists){
          exists.should.be.true;
          done();
        });
      });

      it('should have uploaded the file', function(done){
        this.s3_bucket.file_exists(this.s3_key, function(exists){
          exists.should.be.true;
          done();
        });
      });
    });

    describe('deleting a file from the bucket', function(done){
      it('should try to delete an existing file', function(done){
        this.s3_bucket.file_exists(this.s3_key, function(exists){
          exists.should.be.true;
          done();
        });
      });

      it('should delete the file', function(done){
        self = this;
        this.s3_bucket.file_delete(this.s3_key, function() {
          self.s3_bucket.file_exists(self.s3_key, function(exists){
            exists.should.be.false;
            done();
          });
        });
      });
    });
  });

  describe('deleting the bucket', function(){
    it('should try to delete an existing bucket', function(done){
      this.s3_bucket.exists(function(exists){
        exists.should.be.true;
        done();
      });
    });

    it('should delete the bucket', function(done){
      self = this;
      this.s3_bucket.delete(function() {
        self.s3_bucket.exists(function(exists){
          exists.should.be.false;
          done();
        });
      });
    });
  });
});


