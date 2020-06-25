var fs = require('fs'),
    request = require('request'),
    path = require('path');

function mkDirByPathSync(targetDir, {isRelativeToScript = false} = {}) {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }

    }

    return curDir;
  }, initDir);
}

module.exports = function(uri, filename, done) {
    //accounts for sub-folders in the file name for the key in S3
    let filepath = filename.substring(0, filename.lastIndexOf('/'))
    mkDirByPathSync('./.tmp/fetch_upload_s3/'+filepath);

    var r = request(uri);
    r.on('response', function(resp) {
        if (resp.statusCode === 200) {
            var download_stream = fs.createWriteStream('./.tmp/fetch_upload_s3/'+filename);
            download_stream.on('close', done);
            r.pipe(download_stream);
        }
        else {
            done(new Error('error: '+resp.statusCode));
        }
    });
};
