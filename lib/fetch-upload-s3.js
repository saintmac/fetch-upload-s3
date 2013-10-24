 /* Created by
 * User: saintmac
 * Date: 22/10/13
 */

var init_tmp = require('./init_tmp'),
    download = require('./download'),
    S3Bucket = require('./bucket');

var ready = false;
init_tmp(function(){
  ready = true;
});

var FUS3 = function(s3_bucket_name) {
};

FUS3.prototype.init = function(done) {
  this.bucket = new S3Bucket(s3_bucket_name);
  init_tmp(done);
};

FUS3.prototype.do = function (resource_to_fetch_url, s3_bucket, s3_key, done) {
  if (!ready) {
    return done('not ready yet, try again');
  }
  download(resource_to_fetch_url, s3_key, function(err){
    if (err) {
      return done(err);
    }
  });
};

module.exports = FUS3;


