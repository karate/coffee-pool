//import User from './user.js'
import Timeline from './timeline.js'

class WS {
  constructor () {
  }

  initialize (username, icon) {
    this.socket = new WebSocket('ws://localhost:9898/');
    var s = this.socket;
    this.socket.onopen = function() {
        console.log('WebSocket Client Connected');
        // Create user
        var idxInCookie = document.cookie.split('=')[1]
        var d = {type: 'createUser', idx: idxInCookie};
        s.send(JSON.stringify(d));
        // Request for windows
        var w = {type: 'requestWindowList'};
        s.send(JSON.stringify(w));
    };

    this.socket.onmessage = function(message) {
      var payload = JSON.parse(message.data);

      if (payload.type == 'userList') {
        var userListElement = document.getElementById('guest-list');
        userListElement.innerHTML=  '';
        for (var idx in payload.users) {
          var u = payload.users[idx];
          var idxInCookie = document.cookie.split('=')[1]
          this.userList = document.getElementById('guest-list');
          var li = document.createElement('li');
          if (idxInCookie == idx) {
            li.classList.add('current');
          }
          li.innerHTML = '<span class="icon">' + u.icon + '</span>' + u.name;
          this.userList.appendChild(li);
        }
      }
      else if (payload.type == 'windowList') {
        window.timeline.drawWindows(payload.windows);

      }
      else if (payload.type == 'currentUserIdx') {
        document.cookie = 'coffeePool=' + String(payload.idx);
      }
    };
  }


  sendWindow(win) {
    var d = {type: 'window', win: win}
    this.socket.send(JSON.stringify(d));
  }
}

export default WS;
