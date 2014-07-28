# VideoBooth

This is a really basic demo app showing off `getUserMedia` and Firefox's new `MediaRecorder`
APIs. With a tiny bit of setup, you can allow someone to record themselves in the browser,
then upload to S3 and transcode through Zencoder.

### Setup

You'll need to set up your [AWS](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)
and Zencoder environment variables: `AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, ZENCODER_API_KEY`.
You'll also need to have [CORS](http://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html)
configured on the bucket you use. Here's an example CORS configuration that will work:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```

You'll probably want to restrict `AllowedOrigin` to a little more than the wildcard above.

Once you've got these working, just clone the repo, npm install, and run!

```
$ git clone https://github.com/zencoder/VideoBooth.git
$ cd VideoBooth
$ npm install
$ npm start

Happy hacking!
