var fs = require('fs');

module.exports = function(done) {
  exists_or_mkdir('./.tmp', function() {
    exists_or_mkdir('./.tmp/fetch_upload_s3', function() {
      done();
    });
  });
};

exists_or_mkdir = function(dir_name, done) {
  fs.exists(dir_name, function(exists){
    if (!exists) {
      fs.mkdir(dir_name, function(err) {
        if (err) {
          console.log('an error occured while creating '+dir_name+':');
          console.log(err);
        }
        done(err);
      });
    }
    else {
      done();
    }
  });
};
