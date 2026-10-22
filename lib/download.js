var fs = require('fs'),
    request = require('request');

var TMP_DIR = './.tmp/fetch_upload_s3/';

// uri: a url string or a request options object
// options.timeout (optional): milliseconds to wait for the server before failing
module.exports = function(uri, filename, options, done) {
    if (typeof options === 'function') {
        done = options;
        options = {};
    }
    options = options || {};

    var request_options = typeof uri === 'string' ? {url: uri} : shallow_copy(uri);
    if (options.timeout) {
        request_options.timeout = options.timeout;
    }

    var file_path = TMP_DIR + filename,
        finished = false,
        download_stream = null;

    // request and write stream errors can follow each other or a response:
    // only the first outcome is reported
    var finish = function(err) {
        if (finished) {
            return;
        }
        finished = true;
        if (err && download_stream) {
            // a write error: stop fetching and drop the partial file
            r.abort();
            download_stream.destroy();
            fs.unlink(file_path, function() {
                done(err);
            });
        }
        else {
            done(err);
        }
    };

    var r = request(request_options);
    // without this listener, a network error (ECONNREFUSED, ETIMEDOUT...) is thrown and crashes the process
    r.on('error', finish);
    r.on('response', function(resp) {
        if (resp.statusCode === 200) {
            download_stream = fs.createWriteStream(file_path);
            download_stream.on('error', finish);
            download_stream.on('close', function() {
                finish();
            });
            r.pipe(download_stream);
        }
        else {
            // consume the body so the socket is released
            resp.resume();
            finish(new Error('error: '+resp.statusCode));
        }
    });
};

function shallow_copy(obj) {
    var copy = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = obj[key];
        }
    }
    return copy;
}
