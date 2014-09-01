$(function(){
  var socket = io();

  var sendCommand = function(){
    var textdata = $("#stdin-textarea").val() + '\n';
    console.log('data: ' + textdata);
    socket.emit('eusin', {
      time: Date.now(),
      message: textdata
    });
    $("#stdin-textarea").val("");
  };
  
  $("#send-button").click(sendCommand);

  $("#stdin-textarea").keydown(function(e){
    if(e.ctrlKey && (e.keyCode == 10 || e.keyCode ==13)) {
      // Ctrl + Enter
      e.preventDefault();
      sendCommand();
    } else if(e.ctrlKey && e.keyCode == 67) {
      // Ctrl + C
      e.preventDefault();
      socket.emit('eusrestart', {
        time: Date.now()
      });
    }
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
