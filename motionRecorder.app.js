// Global variables for UI
let counter;
let counterInterval; 
let recordStatus = false; // Variable to track recording state

// Global variables for data recording
const csvFile = 'motionData.csv';
const file = require("Storage").open(csvFile, "a");
let recordInterval; // Interval variable to manage data recording
const frequency = 20; // 1 data record per 20 milisecond 

// Function for read and write sensor data
const writeData = function() {
  timestamp = Date.now(); // Get timestamp
  var accel = Bangle.getAccel(); //Get accelerator data
  var comp = Bangle.getCompass(); //Get compass data
  file.write(timestamp + ", " + accel.x + ", " + accel.y + ", " + accel.z + ", " + accel.mag + ", " + accel.diff + ", " + comp.x + ", " + comp.y + ", " + comp.z + ", " + comp.dx + ", " + comp.dy + ", " + comp.dz + ", " + comp.heading + "\n");
};

// Function for start recording data
const startMotionRecord = function(){
  Bangle.setCompassPower(1); // Activate compass sensor
  // Write Headers
  file.write("timestamp, accel.x, accel.y, accel.z, accel.mag, accel.diff, comp.x, comp.y, comp.z, comp.dx, comp.dy, comp.dz, comp.heading\n");
  // Set up intervals for data recording
  recordInterval = setInterval(writeData, frequency);
};

// Function for stop data
const stopMotionRecord = function(){
  if (recordInterval !== undefined) {
    clearInterval(recordInterval); // Clear recording intervals
    recordInterval = undefined; // Reset interval variable
  };
  Bangle.setCompassPower(0); // Deactivate compass sensor
};

// Function for inform start recording
const startMessage = function () {
  if (counter >= 0) {
    g.clear();  // Clear the screen for fresh output
    E.showMessage(`Start in ${counter} seconds`, "Motion Recorder");
    Bangle.setLCDPower(1); // Keep the watch LCD lit up
    counter--;  // Decrement the counter
    counterInterval = setTimeout(startMessage, 1000); // Schedule next call
  } else {
    clearInterval(counterInterval);
    counterInterval = undefined;
    E.showMessage("Recording (press button to stop)", "Motion Recorder");
  }
};

// Setup UI for button control
Bangle.setUI(); // Clear previous UI settings
Bangle.setUI({
  mode: "custom",
  btn: () => {
    g.clear(); // Clear the screen
    if (recordStatus) {
      stopMotionRecord();
      recordStatus = false;
      E.showMessage("Recording stopped, press button to restart", "Motion Recorder");
    } else {
      // Check and clear counterInterval to prevent bug
      if (counterInterval) {
        clearInterval(counterInterval);
        counterInterval = undefined;
      }
      counter = 5; // Reset the counter
      startMessage(); // Start or restart the countdown
      recordStatus = true;
      startMotionRecord();
    }
  }
});

// Initial message for the UI
E.showMessage("Press button to start recording", "Motion Recorder");