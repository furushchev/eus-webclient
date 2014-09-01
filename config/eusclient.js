var spawn = require('child_process').spawn;
var command = 'roseus';

function Roseus(onStdout, onStderr, onExit){
  this.stdoutCallback = onStdout;
  this.stderrCallback = onStderr;
  this.exitCallback = onExit;
}

Roseus.prototype.run = function run(){
  this.roseus = spawn(command, [], {
    detached: true,
    env: process.env
  });
  this.roseus.stdout.on('data', this.stdoutCallback);
  this.roseus.stderr.on('data', this.stderrCallback);
  this.roseus.on('error', function(err){
    console.log('error on pid ' + this.roseus.pid + ' :' + err);
  });
  this.roseus.on('exit', this.exitCallback);
};

Roseus.prototype.shutdown = function shutdown(){
  this.roseus.kill();
};

Roseus.prototype.command = function command(data){
  this.roseus.stdin.write(data);
//  this.roseus.stdin.end();
};

module.exports = Roseus;
