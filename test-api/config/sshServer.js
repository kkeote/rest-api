var SSH = require('simple-ssh');
var sshConfig = require('./sshconfig.js');


module.exports = {execServerCmd};

function execServerCmd(ip_addr, cmd, done) {
  var varCmdOutput;

    var ssh = new SSH({
        host: ip_addr,
        user: sshConfig.user,
        key:  sshConfig.key
    });


    ssh.exec(cmd, {
        out: function(stdout) {
            console.log(stdout);
            varCmdOutput = stdout;
            done(stdout);
        }
    }).start();

    //done(varCmdOutput);


}
