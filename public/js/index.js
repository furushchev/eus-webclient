$(function(){
  var socket = io();
  
  $("#send-button").click(function(){
    var textdata = $("#stdin-textarea").val() + '\n';
    console.log('data: ' + textdata);
    socket.emit('eusin', {
      time: Date.now(),
      message: textdata
    });
    $("#stdin-textarea").val("");
  });

  socket.on('eusout', function(msg){
    var line = '[' + msg.time + '] ' + msg.message + '\n';
    console.log('eusout: ' + line);
    $("#stdout-textarea").val($("#stdout-textarea").val() + line);
  });

  socket.on('euserr', function(msg){
    var line = '[' + msg.time + '] ' + msg.message + '\n';
    console.log('euserr: ' + line);
    $("#stderr-textarea").val($("#stderr-textarea").val() + line);
  });
});
