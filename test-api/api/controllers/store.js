'use strict';
    // Include our "db"
    var db = require('../../config/sqlStore');
    // Exports all the functions to perform on the db
    module.exports = {getStoreURL};


    //GET /store/url/{store_no}
    function getStoreURL(req, res, next) {
        var store_no = req.swagger.params.store_no.value; //req.swagger contains the path parameters
        var out_result;
        console.log('getStore');
        db.queryStoreURL(store_no, (function (result) {
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
