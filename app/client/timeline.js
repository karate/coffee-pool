import Cookie from './cookies.js'

class Timeline {
  constructor (startTime, endTime) {
    // Get some elements from the HTML
    this.completed = document.getElementById('completed');
    this.windows = document.getElementById('windows');
    this.currentTime = document.getElementById('current-time');
    this.startTimeElement = document.getElementById('start-time');
    this.endTimeElement = document.getElementById('end-time');

    // Script properties
    this.minHour = startTime;
    this.maxHour = endTime;
    this.hourSpan = this.maxHour - this.minHour;
    this.myWindows = [];
  }

  // Called every second, Updates the screen (clock and timeline)
  updateTime() {
    var now = new Date();
    var time = this.formatTime(now);
    var perc = this.getPercentageOfDay(now);

    this.currentTime.innerHTML = time;
    this.completed.style.width = perc + "%";
  }

  // Given a date object, returns the time in hh:mm:ss format
  formatTime( date ) {
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();

    return hours + ':' + minutes.substr(-2);
  }

  // Given a date, returns the repcentage of the day passed.
  getPercentageOfDay(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var perc = ( hours - this.minHour + ( minutes / 60 ) ) / this.hourSpan * 100;
    return perc.toFixed(2);
  }


  // Draw available hours (windows).
  drawWindows(windows) {
    this.windows.innerHTML = '';
    for (var i = 0; i < windows.length; i++) {
      var windowData = windows[i];
      var startDate = new Date(windowData.start);
      var endDate = new Date(windowData.end);
      // Convert start and end times to percentage
      var startPerc = this.getPercentageOfDay(startDate);
      var endPerc = this.getPercentageOfDay(endDate);
      // Create the window
      var win = document.createElement('div');
      win.start = startDate;
      win.end = endDate;
      var idxInCookie = Cookie.getCookie('coffeePool');
      if (idxInCookie == windowData.owner) {
        win.classList.add('mine');
        // Remove window on click
        win.addEventListener("click", function(){
          window.ws.removeWindow({start: this.start, end: this.end, userIdx: idxInCookie});
        });
      }
      // Position
      win.style.marginLeft = startPerc + "%";
      win.style.width = "{0}%".replace("{0}", endPerc - startPerc);
      // Add text (time span)
      var start = this.formatTime(startDate);
      var end = this.formatTime(endDate);
      win.innerHTML = start + ' - ' + end;
      this.windows.appendChild(win);
    }
  }

  // Create marks in the timeline
  // TODO: Compensate for small screens
  createTimelineMarks() {
    for (var hour = this.minHour; hour < this.maxHour; hour++) {
      var stepWidth = 1 / this.hourSpan * 100;
      var markLine = document.createElement('span');
      markLine.innerHTML = hour + ":00";
      markLine.style.width = stepWidth + "%";
      document.getElementById('time-marks').appendChild(markLine);
    }
  }

  createWindow(startDate, endDate) {
    if (!startDate) {
      this.startTimeElement = document.getElementById('start-time');
      if (this.startTimeElement.value) {
        startDate = new Date();
        var s = this.startTimeElement.value.split(':');
        startDate.setHours(s[0]);
        startDate.setMinutes(s[1]);
      }
      else {
        // Random start/end times
        var startDate = new Date();
        startDate.setHours(Math.round(this.minHour + (Math.random() * (this.hourSpan - 1))));
        startDate.setMinutes(Math.round(Math.random() * 5) * 10);
      }
    }
    if (!endDate) {
      this.endTimeElement = document.getElementById('end-time');
      if (this.endTimeElement.value) {
        endDate = new Date();
        var s = this.endTimeElement.value.split(':');
        endDate.setHours(s[0]);
        endDate.setMinutes(s[1]);
      }
      else {
        // Random start/end times
        var endDate = new Date();
        var startDateHours = startDate.getHours();
        endDate.setHours(Math.round(startDateHours + 1 + (Math.random() * (this.maxHour - startDateHours - 1))));
        endDate.setMinutes(0);
      }
    }
    //this.addWindow(startTime, endTime);
    window.ws.sendWindow({start: startDate, end: endDate})
  }

  populateStartEndTimeInputs() {
    // Update default values in start/end time input elements
    var now = new Date();
    this.startTimeElement.value = this.formatTime(now);
    var defaultDuration = 40; // in minutes
    var endTime = new Date(now.getTime() + defaultDuration * 60000);
    this.endTimeElement.value = this.formatTime(endTime);
  }
}

export default Timeline;
