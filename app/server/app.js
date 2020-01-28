// Node.js WebSocket server script
var User = require('./user.js');

const http = require('http');
const WebSocketServer = require('websocket').server;
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');

const userList = {};
const userHistory = {};
const clients = [];
const windowList = [];
var userIdx = 0;

var serve = serveStatic('app/client', { 'index': ['index.html'] });
var WebServer = http.createServer(function onRequest (req, res) {
  serve(req, res, finalhandler(req, res))
})
WebServer.listen(8080);

const server = http.createServer();
server.listen(9898);

const wsServer = new WebSocketServer({
    httpServer: server
});

function broadcast( message ) {
  console.log("Broadcasting: ", message)
    for (var i=0; i < clients.length; i++) {
      clients[i].sendUTF(message);
    }
}

wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    connection.userIdx = String(userIdx);
    userIdx += 1;

    connection.on('message', function(message) {
      var payload = JSON.parse(message.utf8Data);
      // Connection request by client
      if (payload.type == 'createUser') {
        if (payload.idx) {
          connection.userIdx = String(payload.idx);
        }

        // User currently logged in
        if (Object.keys(userList).includes(payload.idx)) {
          console.log('User currenlty logged in. skipping');
        }
        else {
          // returning user
          console.log('Request for user: ', payload.idx);
          if (Object.keys(userHistory).includes(payload.idx)) {
            user = userHistory[payload.idx];
            console.log('Found: ', user);
          }
          else {
            user = new User();
            userHistory[connection.userIdx] = user;
            console.log('Not found. Creating: ', user);
            var u = JSON.stringify({type: 'currentUserIdx', idx: connection.userIdx});
            connection.sendUTF(u);
          }
          // Add to client list
          clients.push(connection);
          userList[connection.userIdx] = user;
          console.log('New user: ' + connection.userIdx, user );
        }
        broadcast(JSON.stringify({type: 'userList', users: userList}))
      }
      else if (payload.type == 'message' ) {
        // broadcast message to all connected clients
        broadcast(message.utf8Data);
      }
      else if (payload.type == 'window' ) {
        console.log(payload);
        var now = new Date();
        var start = new Date(payload.win.start);
        var end = new Date(payload.win.end);
        if (start < end && end > now) {
          payload.win.owner = connection.userIdx;
          windowList.push(payload.win);
          broadcast(JSON.stringify({type: 'windowList', windows: windowList}));
        }
      }
      else if (payload.type == 'requestWindowList' ) {
        connection.sendUTF(JSON.stringify({type: 'windowList', windows: windowList}));
      }
    });

    connection.on('close', function(reasonCode, description) {
      delete userList[connection.userIdx];
      console.log('User left: ' + connection.userIdx);
      broadcast(JSON.stringify({type: 'userList', users: userList}))
    });
});
