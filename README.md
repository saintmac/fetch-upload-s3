fetch-upload-s3
===============

Fetches an asset (picture for instance) from a remote URL and uploads it to Amazon S3

## install

```javascript
npm install fetch-upload-s3
```

## setup
### credentials
create an aws_config.json file with the following fields. You can put whatever region you like.

```json
{
  "accessKeyId": "YOUR AWS ACCESS KEY",
  "secretAccessKey": "SECRET OF YOUR AWS ACCESS KEY",
  "region": "eu-west-1"
}
```

## use

```javascript
var FUS3 = require('fetch-upload-s3');

var fus3 = new FUS3('my_aws_bucket');
fus3.init(function(){
  this.fus3.do('http://nodejs.org/images/logo.png', 'my_key', function(err){
    console.log('file uploaded to S3!');
  };
});

```




