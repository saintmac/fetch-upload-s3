var should = require('chai').should(),
    download = require('../lib/download'),
    FUS3 = require('../lib/fetch-upload-s3'),
    init_tmp = require('../lib/init_tmp'),
    http = require('http'),
    fs = require('fs');


describe('download', function(){
  var server, base_url, closed_port_url;

  before(function(done) {
    server = http.createServer(function(req, res) {
      if (req.url === '/picture.png') {
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.end('not really a png');
      }
      else if (req.url === '/cut.png') {
        // headers and part of the body, then the connection drops
        res.writeHead(200, {'Content-Type': 'image/png', 'Content-Length': 100000});
        res.write('partial');
        setImmediate(function() { res.socket.destroy(); });
      }
      else if (req.url === '/hang.png') {
        // accepts the connection and never answers
      }
      else {
        res.writeHead(404);
        res.end('not found');
      }
    });
    server.listen(0, '127.0.0.1', function() {
      base_url = 'http://127.0.0.1:' + server.address().port;
      // a port nobody listens on: the connection is refused
      var probe = http.createServer().listen(0, '127.0.0.1', function() {
        closed_port_url = 'http://127.0.0.1:' + probe.address().port + '/picture.png';
        probe.close(function() {
          init_tmp(done);
        });
      });
    });
  });

  after(function(done) {
    server.close(function() { done(); });
    // the hanging request keeps its socket open
    if (server.closeAllConnections) {
      server.closeAllConnections();
    }
  });

  describe('for a non 200 url', function() {
    it('should return an error', function(done) {
      download(base_url + '/missing.png', '404.png', function(err) {
        should.exist(err);
        err.message.should.equal('error: 404');
        done();
      });
    });

    it('should NOT have created the file', function(done) {
      fs.exists('./.tmp/fetch_upload_s3/404.png', function(exists){
        exists.should.be.false;
        done();
      });
    });
  });

  describe('for a 200 url', function() {
    before(function(done){
      download(base_url + '/picture.png', 'picture.png', done);
    });

    it('should have created the file', function(done) {
      fs.readFile('./.tmp/fetch_upload_s3/picture.png', 'utf8', function(err, content){
        should.not.exist(err);
        content.should.equal('not really a png');
        done();
      });
    });
  });

  describe('for a request options object', function() {
    it('should download the file', function(done) {
      download({method: 'GET', url: base_url + '/picture.png'}, 'options.png', function(err) {
        should.not.exist(err);
        fs.exists('./.tmp/fetch_upload_s3/options.png', function(exists){
          exists.should.be.true;
          done();
        });
      });
    });
  });

  describe('when the connection fails', function() {
    it('should return the error instead of throwing it', function(done) {
      download(closed_port_url, 'refused.png', function(err) {
        should.exist(err);
        err.code.should.equal('ECONNREFUSED');
        done();
      });
    });

    it('should call back only once', function(done) {
      var calls = 0;
      download(closed_port_url, 'refused_once.png', function(err) {
        calls += 1;
      });
      setTimeout(function() {
        calls.should.equal(1);
        done();
      }, 200);
    });

    it('should NOT have left a file', function(done) {
      fs.exists('./.tmp/fetch_upload_s3/refused.png', function(exists){
        exists.should.be.false;
        done();
      });
    });
  });

  describe('when the connection drops after the headers', function() {
    it('should return an error and leave no file once called back', function(done) {
      download(base_url + '/cut.png', 'cut.png', function(err) {
        should.exist(err);
        fs.exists('./.tmp/fetch_upload_s3/cut.png', function(exists){
          exists.should.be.false;
          done();
        });
      });
    });
  });

  describe('when the file cannot be written', function() {
    it('should return the error instead of throwing it', function(done) {
      download(base_url + '/picture.png', 'no/such/dir/picture.png', function(err) {
        should.exist(err);
        err.code.should.equal('ENOENT');
        done();
      });
    });
  });

  describe('when an existing file cannot be opened for writing', function() {
    var readonly_path = './.tmp/fetch_upload_s3/readonly.png';

    before(function(done) {
      fs.writeFile(readonly_path, 'keep me', function(err) {
        if (err) { return done(err); }
        fs.chmod(readonly_path, 292, done); // 0444
      });
    });

    after(function(done) {
      fs.chmod(readonly_path, 420, function() { // 0644
        fs.unlink(readonly_path, function() { done(); });
      });
    });

    it('should return the error and leave the existing file alone', function(done) {
      if (process.getuid && process.getuid() === 0) {
        return this.skip ? this.skip() : done(); // root can open a read-only file
      }
      download(base_url + '/picture.png', 'readonly.png', function(err) {
        should.exist(err);
        err.code.should.equal('EACCES');
        fs.readFile(readonly_path, 'utf8', function(err, content) {
          should.not.exist(err);
          content.should.equal('keep me');
          done();
        });
      });
    });
  });

  describe('with a timeout', function() {
    it('should return an error when the server does not answer in time', function(done) {
      download(base_url + '/hang.png', 'hang.png', {timeout: 100}, function(err) {
        should.exist(err);
        err.code.should.match(/^E(SOCKET)?TIMEDOUT$/);
        done();
      });
    });
  });

  describe('FUS3 with a timeout option', function() {
    it('should fail do() when the server does not answer in time', function(done) {
      var fus3 = new FUS3('unused-bucket', {timeout: 100});
      fus3.do(base_url + '/hang.png', 'fus3_hang.png', function(err) {
        should.exist(err);
        err.code.should.match(/^E(SOCKET)?TIMEDOUT$/);
        done();
      });
    });
  });
});
