// Do the vendor prefix dance
navigator.getUserMedia  = navigator.getUserMedia    || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

// Set up an error handler on the callback
var errCallback = function(e) {
  console.log('Did you just reject me?!', e);
};

// Request the user's media
function requestMedia(e) {
  e.preventDefault();

  // Use the vendor prefixed getUserMedia we set up above and request just video
  navigator.getUserMedia({video: true, audio: false}, showMedia, errCallback);
}

function showMedia(stream) {
  var video = document.getElementById('user-media');
  video.src = window.URL.createObjectURL(stream);

  video.onloadedmetadata = function(e) {
    console.log('Locked and loaded.');
  };
}

$(function() {
  $('#get-user-media').click(requestMedia);
});
