// Import modules
import Timeline from './timeline.js';
import WS from './websockets.js'

// Create a Timeline Object
window.ws = new WS();
window.timeline = new Timeline(8, 20);

// Functions that should be available in html 'onlick=' attribute
// will be assinged to `window`
window.addWindow = function() {
  window.timeline.createWindow();
}

function initialize() {
  // TESTING: Create some windows
  window.ws.initialize();
  window.timeline.populateStartEndTimeInputs();
  window.timeline.createTimelineMarks();
  window.timeline.updateTime();
  window.setInterval(function() {
    window.timeline.updateTime();
  }, 5000);
}

initialize();
