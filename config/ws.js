var util = require('util');
var SocketIO = require('socket.io');
var Eusclient = require('./eusclient');

module.exports = function(server){
  var io = SocketIO.listen(server);
//  io.set('transports', [ 'websocket' ]);
  var maxEusClient = 5;
  var currentConnection = 0;

  io.sockets.on('connection', function(socket){
    var roseus = null;
    if(currentConnection >= maxEusClient) {
      console.log('max client error');
      socket.emit('error', {
        type: "Max Eusclient Error",
        message: "Cannot start eus client more than limits!"
      });
    } else {
      // start eus
      roseus = new Eusclient(
        function(data){
          // stdout
          socket.emit('eusout', {
            'time' : Date.now(),
            'message': "" + data
          });
          console.log('send stdout: ' + data);
        },
        function(data){
          // stderr
          socket.emit('euserr', {
            'time': Date.now(),
            'message': "" + data
          });
          console.log('send stderr: ' + data);
        },
        function(code){
          // shutdown eus
          console.log('process exited(' + code + ')');
          socket.emit('euserr', {
            'time': Date.now(),
            'message': "process exited.(" + code + ")"
          });
          currentConnection--;
        });
      roseus.run();
      currentConnection++;
      console.log('client started. ' + currentConnection);
    }

    socket.on('eusin', function(data){
      console.log('received: ' + util.inspect(data));
      if(roseus != null)
        roseus.command(data.message);
    });

    socket.on('disconnect', function(){
      if(roseus != null)
        roseus.shutdown();
      console.log('disconnected');
    });
  });
};
