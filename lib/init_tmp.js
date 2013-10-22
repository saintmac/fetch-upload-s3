var fs = require('fs');

module.exports = function() {
  fs.exists('./.tmp', function(exists){
    if (!exists) {
      fs.mkdir('./.tmp', function(err) {
        if (err) {
          console.log('an error occured while creating /.tmp');
        }
        else {

        }
      });
    }
  });
};
