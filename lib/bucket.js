var AWS = require('aws-sdk'),
    fs = require('fs');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

var S3Bucket = function(bucket_name) {
  this.bucket = new AWS.S3({params: {Bucket: bucket_name}});
};


S3Bucket.prototype.upload = function(file_path, s3_key, done) {
  var self = this;
  fs.readFile(file_path, function(err, data){
    if (err) {
      return done(err);
    }
    var options = {
      Key: s3_key,
      Body: data
    };
    self.bucket.putObject(options, function(err, data){
      done(err, data);
    });
  });
};

S3Bucket.prototype.file_exists = function(s3_key, done) {
  this.bucket.headObject({Key: s3_key}, function(err, data){
    if (!err && data) {
      done(true);
    }
    else {
      done(false);
    }
  });
};

S3Bucket.prototype.exists = function(done) {
  this.bucket.headBucket({}, function(err, data){
   if (!err && data) {
     done(true);
   }
   else {
     done(false);
   }
  });
};

S3Bucket.prototype.create = function(done) {
  this.bucket.createBucket({ACL: "bucket-owner-full-control"}, done);
};

S3Bucket.prototype.file_delete = function(s3_key, done) {
  options = {
    Key: s3_key
  };
  this.bucket.deleteObject(options, done);
};

S3Bucket.prototype.delete = function(done) {
  this.bucket.deleteBucket(done);
};

module.exports = S3Bucket;
