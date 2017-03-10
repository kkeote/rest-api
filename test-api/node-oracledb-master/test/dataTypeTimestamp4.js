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
 * The node-oracledb test suite uses 'mocha', 'should' and 'async'.
 * See LICENSE.md for relevant licenses.
 *
 * NAME
 *   36. dataTypeTimestamp4.js
 *
 * DESCRIPTION
 *    Testing Oracle data type support - TIMESTAMP (2) WITH TIME ZONE.
 *
 * NOTE
 *   TIMESTAMP support is still under enhancement request. This test is suspended.
 *
 * NUMBERING RULE
 *   Test numbers follow this numbering rule:
 *     1  - 20  are reserved for basic functional tests
 *     21 - 50  are reserved for data type supporting tests
 *     51 onwards are for other tests
 *
 *****************************************************************************/
'use strict';

var oracledb = require('oracledb');
var should   = require('should');
var async    = require('async');
var dbConfig = require('./dbconfig.js');

describe('36. dataTypeTimestamp4.js', function() {

  var connection = null;
  var tableName = "nodb_datatype_timestamp";
  var sqlCreate =
        "BEGIN " +
           "   DECLARE " +
           "       e_table_missing EXCEPTION; " +
           "       PRAGMA EXCEPTION_INIT(e_table_missing, -00942); " +
           "   BEGIN " +
           "       EXECUTE IMMEDIATE ('DROP TABLE " + tableName + " PURGE'); " +
           "   EXCEPTION " +
           "       WHEN e_table_missing " +
           "       THEN NULL; " +
           "   END; " +
           "   EXECUTE IMMEDIATE (' " +
           "       CREATE TABLE " + tableName +" ( " +
           "           num NUMBER, " +
           "           content TIMESTAMP(2) WITH TIME ZONE "  +
           "       )" +
           "   '); " +
           "END; ";
  var sqlDrop = "DROP table " + tableName + " PURGE";
  before( function(done){
    oracledb.getConnection(
      {
        user:          dbConfig.user,
        password:      dbConfig.password,
        connectString: dbConfig.connectString
      },
      function(err, conn){
        should.not.exist(err);
        connection = conn;
        connection.execute(
          sqlCreate,
          function(err) {
            should.not.exist(err);
            done();
          }
        );
      }
    );
  });

  after( function(done){
    connection.execute(
      sqlDrop,
      function(err) {
        if(err) { console.error(err.message); return; }
        connection.release( function(err) {
          if(err) { console.error(err.message); return; }
          done();
        });
      }
    );
  });

  it('supports TIMESTAMP WITH TIME ZONE data type', function(done) {
    connection.should.be.ok();

    var timestamps = [
      new Date(-100000000),
      new Date(0),
      new Date(10000000000),
      new Date(100000000000)
    ];

    var sqlInsert = "INSERT INTO " + tableName + " VALUES(:no, :bindValue)";

    async.forEach(timestamps, function(timestamp, callback) {
      connection.execute(
        sqlInsert,
        { no: timestamps.indexOf(timestamp), bindValue: timestamp },
        function(err) {
          should.not.exist(err);
          callback();
        }
      );
    }, function(err) {
      should.not.exist(err);
      connection.execute(
        "SELECT * FROM " + tableName,
        [],
        { outFormat: oracledb.OBJECT },
        function(err, result) {
          should.exist(err);
          (err.message).should.startWith('NJS-010:'); // unsupported data type in select list
          should.not.exist(result);
          /*
          console.log(result);
          for(var j = 0; j < timestamps.length; j++)
            result.rows[j].CONTENT.toUTCString().should.eql(timestamps[result.rows[j].NUM].toUTCString());
          */
          done();
        }
      );
    });
  });

});
