var SSH = require('simple-ssh');


var a = ["10.11.61.51", "10.11.61.52", "10.11.61.53"];
a.forEach(function(entry) {
    console.log(entry);



    var ssh = new SSH({
        host: entry,
        user: 'wcsuser',
        //pass: 'route123'
        key:  require('fs').readFileSync("./id_rsa")
    });





    ssh.exec('png && hostname  && date', {
        //out: function(stdout) {
          //  console.log(stdout);
        //}
        err: function(stderr) {
          console.log(stderr);
        }
        out: function(stdout) {
          console.log(stdout);
        }
    }).start();

    ssh.exec('uptime', {
        out: function(stdout) {
            console.log(stdout);
        }
    }).start();

    /*** Using the `args` options instead ***/
    ssh.exec('echo', {
        args: ['$PATH'],
        out: function(stdout) {
            console.log(stdout);
        }
    }).start();


});
