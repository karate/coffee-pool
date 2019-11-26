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
      // Convert start time to Date object
      var startDate = new Date();
      var startDateElements = windowData.start.split(':');
      startDate.setHours(startDateElements[0], startDateElements[1], 0, 0);

      // Convert end time to Date object
      var endDate = new Date();
      var endDateElements = windowData.end.split(':');
      endDate.setHours(endDateElements[0], endDateElements[1], 0, 0);

      // Convert start and end times to percentage
      var startPerc = this.getPercentageOfDay(startDate);
      var endPerc = this.getPercentageOfDay(endDate);
      // Create the window
      var win = document.createElement('div');
      var idxInCookie = document.cookie.split('=')[1];
      if (idxInCookie == windowData.owner) {
          win.classList.add('mine');
      }
      // Position
      win.style.marginLeft = startPerc + "%";
      win.style.width = "{0}%".replace("{0}", endPerc - startPerc);
      // Add text (time span)
      win.innerHTML = windowData.start + ' - ' + windowData.end;
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

  // Creates a time window
  addWindow(startTime = null, endTime = null) {
    if (startTime == null) startTime = this.startTimeElement.value;
    if (endTime == null) endTime = this.endTimeElement.value;
    // TESTING: If start and end time is empty, create random window
    this.myWindows.push({start: startTime, end: endTime});
    // Clear input fields
    this.startTimeElement.value = '';
    this.endTimeElement.value = '';

    this.drawWindows();
  }

  createWindow(startTime, endTime) {
    if (!startTime || !endTime) {
      // Random start/end times
      var sh = Math.round(this.minHour + (Math.random() * (this.hourSpan - 1)));
      var eh = Math.round(sh + 1 + (Math.random() * (this.maxHour - sh - 1)));

      var sm = Math.round(Math.random() * 5) * 10;
      var em = '00';

      startTime = sh + ":" + sm;
      endTime = eh + ":" + em;
    }
    //this.addWindow(startTime, endTime);
    window.ws.sendWindow({start: startTime, end: endTime})
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
