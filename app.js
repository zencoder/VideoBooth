var S3_BUCKET = 'zen-tests';

var express    = require('express');
var path       = require('path');
var logger     = require('morgan');
var bodyParser = require('body-parser');
var crypto     = require('crypto');
var moment     = require('moment');
var AWS        = require('aws-sdk');
var s3         = new AWS.S3({ params: { Bucket: S3_BUCKET }});
var zencoder   = require('zencoder')();

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/process', function(req, res) {
  // Build up the S3 URL based on the specified S3 Bucket and filename included
  // in the POST request body.
  var input = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.body.filename;
  createJob(input, req.body.email, function(err, data) {
    if (err) { return res.send(500, err); }

    res.send(200, data);
  });
});

app.post('/upload', function(req, res) {
  var cors = createS3Policy();
  res.send(201, { url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/', cors: cors });
});

function createS3Policy() {
  var policy = {
    "expiration": moment().utc().add('days', 1).toISOString(),
    "conditions": [
      { "bucket": S3_BUCKET },
      { "acl":"private" },
      [ "starts-with", "$key", "" ],
      [ "starts-with", "$Content-Type", "" ],
      [ "content-length-range", 0, 5368709120 ]
    ]
  };

  var base64Policy = new Buffer(JSON.stringify(policy)).toString('base64');
  var signature = crypto.createHmac('sha1', AWS.config.credentials.secretAccessKey).update(base64Policy).digest('base64');

  return {
    key: AWS.config.credentials.accessKeyId,
    policy: base64Policy,
    signature: signature
  };
}

function createJob(input, email, cb) {
  var watermark = {
    url: 'https://s3.amazonaws.com/zencoder-demo/blog-posts/videobooth.png',
    x: '-0',
    y: '-0',
    width: '30%'
  };

  zencoder.Job.create({
    input: input,
    notifications: [ email ],
    outputs: [
      { format: 'mp4', watermarks: [watermark] },
      { format: 'webm', watermarks: [watermark] }
    ]
  }, cb);
}

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
