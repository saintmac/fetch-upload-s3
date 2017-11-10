fetch-upload-s3
===============

Fetches an asset (picture for instance) from a remote URL (or a local file) and uploads it to Amazon S3.

## install

```javascript
npm install fetch-upload-s3
```

## setup
### credentials
Create app environment variables and set

`AWS_ACCESS_KEY_ID`

`AWS_SECRET_ACCESS_KEY`

`AWS_REGION`

You can use different bucket name depending on your environment.

## use

```javascript
var FUS3 = require('fetch-upload-s3');

var fus3 = new FUS3('my_aws_bucket');

// For fetch url :
fus3.init(function(){
  fus3.do('http://nodejs.org/images/logo.png', 'my_key', function(err, data){
    console.log('file uploaded to S3!');
    console.log(data);
  });
});

// for upload File :
fus3.init(function(){
  fus3.uploadFile(absoluteFilePath, 'my_key',
    function(err, data){
    console.log('file uploaded to S3!');
    console.log(data);
  });
});
```


A temp folder './.tmp/fetch_upload_s3' is used as a proxy.
Temporary and source files are deleted locally as soon as they have been uploaded to S3
