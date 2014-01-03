var fs = require('fs'),
    request = require('request');

module.exports = function(uri, filename, done) {
    var r = request(uri);
    r.on('response', function(resp) {
        if (resp.statusCode === 200) {
            var download_stream = fs.createWriteStream('./.tmp/fetch_upload_s3/'+filename);
            download_stream.on('close', done);
            r.pipe(download_stream);
        }
        else {
            done('error: '+resp.statusCode)
        }
    });
};
