/* Copyright (c) 2015, 2016, Oracle and/or its affiliates. All rights reserved. */

/******************************************************************************
 *
 * You may not use the identified files except in compliance with the Apache
 * License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * NAME
 *   select1.js
 *
 * DESCRIPTION
 *   Executes a basic query without using a connection pool or ResultSet.
 *   Uses Oracle's sample HR schema.
 *
 *   Scripts to create the HR schema can be found at:
 *   https://github.com/oracle/db-sample-schemas
 *
 *   For a connection pool example see webapp.js
 *   For a ResultSet example see resultset2.js
 *   For a query stream example see selectstream.js
 *   For a Promise example see promises.js
 *
 *****************************************************************************/

var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
//oracledb.outFormat = oracledb.OBJECT;

//var retVal = {};


module.exports = {queryStoreURL};

function queryStoreURL(store_no, done) {



// Get a non-pooled connection
oracledb.getConnection(
  {
    user          : dbConfig.user,
    password      : dbConfig.password,
    connectString : dbConfig.connectString
  },
  function(err, connection)
  {
    if (err) {
      console.log(err.message);
      return;
    }
    connection.execute(
      // The statement to execute
      //"SELECT department_id, department_name " +
      //  "FROM departments " +
      //  "WHERE department_id = :id",

        "select bncb_store_id, field3 from wcsuser.zz_store_ext where bncb_store_id = :id",

      // The "bind value" 180 for the "bind variable" :id
      [store_no],

      // Optional execute options argument, such as the query result format
      // or whether to get extra metadata
       { outFormat: oracledb.OBJECT, extendedMetaData: true },

      // The callback function handles the SQL execution results
      function(err, result)
      {
        if (err) {
          console.log(err.message);
          doRelease(connection);
          //done(err);
          return;
        }

        //console.log(jsonRep);

        //console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
        //console.log(result.rows);     // [ [ 180, 'Construction' ] ]

        jsonRep = JSON.stringify(result.rows);
        console.log(jsonRep);

        doRelease(connection);
        done(result.rows);
      });
  });
}

// Note: connections should always be released when not needed
function doRelease(connection)
{
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}
