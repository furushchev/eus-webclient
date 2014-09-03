var spawn = require('child_process').spawn;
var path = require('path');
var command = 'roseus'; // ' + path.join(__dirname, 'default.l');

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

    this.roseus.stdin.write('(load "package://hrpsys_ros_bridge_tutorials/euslisp/samplerobot-interface.l") (samplerobot-init)');
};

Roseus.prototype.shutdown = function shutdown(){
  this.roseus.kill('SIGINT');
    console.log('sent SIGINT to roseus');
    setTimeout(function(){
	if(this.roseus) {
	    this.roseus.kill();
	    console.log('escalated to SIGKILL');
	}
    }, 10000);
};

Roseus.prototype.command = function command(data){
  this.roseus.stdin.write(data);
//  this.roseus.stdin.end();
};

module.exports = Roseus;
