"use strict";
// Import express
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const server = require('http').createServer(app)
const cors = require('cors')
const history = require('connect-history-api-fallback')
global.io = require('socket.io').listen(server)
require("nodejs-dashboard")
global.handleStatus = require('./helpers/StatusHandlers.js')
// Load config for RethinkDB and express
const config = require(__dirname + '/config.js');

let r = require('rethinkdb');

app.use(cors())
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

// Middleware that will create a connection to the database
app.use(createConnection);

// Define main routes
app.use(require('./routes'))
app.use('/', express.static(path.join(__dirname, '../dist')))
app.use(history())

require('./controllers/io.js')

// Middleware to close a connection to the database
app.use(closeConnection);

/*
 * Retrieve all todos
 */
function get(req, res, next) {
    r.table('content').orderBy({index: "createdAt"}).run(req._rdbConn).then(function(cursor) {
        return cursor.toArray();
    }).then(function(result) {
        res.send(JSON.stringify(result));
    }).error(
        handleStatus.NError(res)
    )
    .finally(next);
}

/*
 * Create a RethinkDB connection, and save it in req._rdbConn
 */
function createConnection(req, res, next) {
    console.log(config.rethinkdb)
    r.connect(config.rethinkdb).then(function(conn) {
        req._rdbConn = conn;
        next();
    }).error(handleStatus.NError(res));
}

/*
 * Close the RethinkDB connection
 */
function closeConnection(req, res, next) {
    req._rdbConn.close();
}

/*
 * Create tables/indexes then start express
 */
r.connect(config.rethinkdb, function(err, conn) {
    if (err) {
        console.log("Could not open a connection to initialize the database")
        console.log(err.message)
        process.exit(1)
    }

    r.table('content').indexWait('createdAt').run(conn).then(function(err, result) {
        console.log("Table and index are available, starting express...")
        startExpress()
    }).error(function(err) {
        // The database/table/index was not available, create them
        r.dbCreate(config.rethinkdb.db).run(conn).finally(function() {
            return r.tableCreate('content').run(conn)
        }).finally(function() {
            // r.table('content').indexCreate('createdAt').run(conn);
        }).finally(function(result) {
            // r.table('content').indexWait('createdAt').run(conn)
        }).then(function(result) {
            console.log("Table and index are available, starting express...")
            startExpress()
            conn.close()
        }).error(function(err) {
            if (err) {
                console.log("Could not wait for the completion of the index `todos`")
                console.log(err);
                process.exit(1);
            }
            console.log("Table and index are available, starting express...")
            startExpress()
            conn.close()
        })
    })
})

function startExpress() {
    server.listen(config.express.port)
    console.log('Listening on port '+config.express.port)
}
