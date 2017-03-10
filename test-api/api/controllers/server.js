'use strict';
    // Include our "db"
    var SSH_SRV = require('../../config/sshServer');
    // Exports all the functions to perform on the db
    module.exports = {getServerUptime};


    //GET /movie/{id} operationId
    function getServerUptime(req, res, next) {
        var ip_addr = req.swagger.params.ip_addr.value; //req.swagger contains the path parameters
        var out_result;
        var cmd = 'uptime';
        //console.log('getStore');
        SSH_SRV.execServerCmd(ip_addr, cmd, (function (result) {
                //if (err) { 'err:' + console.log(err.message); return; }
                console.log('xxx:' + result);
                out_result = result;
                  console.log('yyy:' + out_result);
                  if(out_result) {
                      res.json(out_result);
                      console.log('zzz:' + out_result);
                  } else {
                      res.status(204).send();
                  }
        }));



    }
