# sonos-control-via-phillips-hue
A simple way to control your Sonos speakers via a Philips Hue control using Node.js and the 
node sonos library.


## Setup:

Edit the default values in the Hue.js:

```bash
const hueBridgeIP = '<hueBridgeIP>'; // Replace with your actual Hue Bridge IP
const hueApiKey = '<hueApiKey>'; // Replace with your actual Hue API Key
const dimmerSensorId = '<dimmervalue>'; // Replace with the ID of your dimmer switch
const sonosDeviceIPs = ['<sonos_ip1>', '<sonos_ip2>', '<sonos_ip3>']; //Sonos IDs

```

Install the necessary sonos library for node:
```bash
npm i sonos

```
## Execute code:

```bash
node hue.js

```


