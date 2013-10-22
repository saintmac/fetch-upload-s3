var fs = require('fs'),
    request = require('request');

module.exports = function(uri, filename, done) {
  var download_stream = fs.createWriteStream('./.tmp/fetch_upload_s3/'+filename);
  download_stream.on('close', function() {
    console.log('file done');
    done();
  });
  request(uri).pipe(download_stream);
};
