var should = require('chai').should(),
    S3Bucket = require('../lib/bucket');


describe('writing to S3', function(){
  before(function(done){
    this.bucket_name = 'test-node-bucket'
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


