const hueBridgeIP = '<hueBridgeIP>'; // Replace with your actual Hue Bridge IP
const hueApiKey = '<hueApiKey>'; // Replace with your actual Hue API Key
const dimmerSensorId = '<dimmervalue>'; // Replace with the ID of your dimmer switch
const sonosDeviceIPs = ['<sonos_ip1>', '<sonos_ip2>', '<sonos_ip3>']; //Sonos IDs

// Store the last updated and button event values
let lastUpdatedValue = '';
let lastButtonEvent = '';
let lastButtonPressTimestamps = [0, 0]; // Timestamps of the last two button presses
const doublePressThreshold = 500; // Adjust as needed (in milliseconds)

const { Sonos } = require('sonos')
const sonosDevices = sonosDeviceIPs.map(ip => new Sonos(ip));

sonosDevices.forEach((sonosDevice, index) => {
  sonosDevice.getName().then(name => console.log(`Device ${index + 1}: ${name}`));
});

// Function to log a message based on button event
function handleDimmerPress(event) {
  let message = '';

  switch (event) {
    case 4000: 
    case 4002: 
      message = 'Dimmer switch turned off';
      pauseOnAllDevices();
      break;

    case 1002: 
    case 1000: 
      message = 'Dimmer switch turned on';
      playOnAllDevices();
      break;

    case 2002: 
    case 2000: 
     
      volumeUpOnAllDevices();
      break;

    case 3002: 
    case 3000: 

      volumeDownOnAllDevices();
      break;

    default:
      message = `Dimmer switch button event: ${event}`;
  }

  console.log(message);
}

//function für die jeweiligen aktionen

// Function to play on all Sonos devices
async function playOnAllDevices() {
  try {
    // Iterate over all Sonos devices and play on each one
    for (const sonosDevice of sonosDevices) {
      await sonosDevice.play();
    }

    console.log('Playback started on all Sonos devices.');
  } catch (error) {
   // console.error('Error:', error);
  }
}

// Function to pause on all Sonos devices
async function pauseOnAllDevices() {
  try {
    // Iterate over all Sonos devices and pause on each one
    for (const sonosDevice of sonosDevices) {
      await sonosDevice.pause();
    }

    console.log('Playback paused on all Sonos devices.');
  } catch (error) {
  //  console.error('Error:', error);
  }
}

// Function to increase volume on all Sonos devices
async function volumeUpOnAllDevices() {
  try {
    // Iterate over all Sonos devices and increase volume on each one
    for (const sonosDevice of sonosDevices) {
      const currentVolume = await sonosDevice.getVolume();
      await sonosDevice.setVolume(currentVolume + 10);
    }

    console.log('Volume increased by 10 on all Sonos devices.');
  } catch (error) {
  //  console.error('Error:', error);
  }
}

// Function to decrease volume on all Sonos devices
async function volumeDownOnAllDevices() {
  try {
    // Iterate over all Sonos devices and decrease volume on each one
    for (const sonosDevice of sonosDevices) {
      const currentVolume = await sonosDevice.getVolume();
      await sonosDevice.setVolume(currentVolume - 10);
    }

    console.log('Volume decreased by 10 on all Sonos devices.');
  } catch (error) {
//    console.error('Error:', error);
  }
}



//IMPORT
// Function to poll the state of the dimmer switch
async function pollDimmerState() {
  try {
    const response = await fetch(`http://${hueBridgeIP}/api/${hueApiKey}/sensors/${dimmerSensorId}`);
    const dimmerSwitch = await response.json();

    // Check for changes in the dimmer switch state
    if (
      dimmerSwitch.state &&
      dimmerSwitch.state.lastupdated &&
      dimmerSwitch.state.lastupdated !== lastUpdatedValue
    ) {

      // Determine the button event
      const buttonEvent = dimmerSwitch.state.buttonevent;

      // Check for double press
      const currentTimestamp = new Date(dimmerSwitch.state.lastupdated).getTime();
      const timeSinceLastPress = currentTimestamp - lastButtonPressTimestamps[1];

      if (buttonEvent !== lastButtonEvent || timeSinceLastPress >= doublePressThreshold) {
        handleDimmerPress(buttonEvent);

        // Update the last button event and last updated values
        lastButtonEvent = buttonEvent;
        lastUpdatedValue = dimmerSwitch.state.lastupdated;
        
        // Update timestamps
        lastButtonPressTimestamps = [lastButtonPressTimestamps[1], currentTimestamp];
      } else {
        console.log('Double press detected');
        // Handle double press action here
        // Reset the timestamps to avoid continuous double press detection
        lastButtonPressTimestamps = [0, 0];
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Poll the dimmer switch state every 1 second (adjust as needed)
setInterval(pollDimmerState, 1000);
console.log("Hallo");
//code by Konrad
