# Lonsonho 9W E27 RGBWW bulb
This configuration is for the Lonsonho 9W E27 RGBWW bulb which is offered as a kit of 2 on [aliexpress.com]. The bulb has no special led drivers built in and uses the esp's pulse with modulation for dimming.

## GPIO Pinout
| Pin | Function |
| ------ | ------ |
| GPIO4 | red channel |
| GPIO12 | green channel |
| GPIO14 | blue channel |
| GPIO13 | warm white channel |
| GPIO5 | cold white channel |

## Getting it up and running
### Tuya Convert

- Use tuya convert to initialy flash tasmota without soldering following [this guide]. 
- At the beginning switch the bulb 4 or 5 times on and off with +- one second delay to enter flashing mode. The bulb blinks rappidly white to confirm flashing mode.
- During the process don't get nervous, keep calm and be patient.
- At the end choose to install tasmota firmware.

Start setting up, creating, compiling and grabbing your own firmware. This is where ESPHome comes in.

**Prerequisit**: ESPHome is installed via Hass.io ADD-ON STORE.

### ESPHome
- Open ESPHome by choosing it in the left side menu in home assistant.
- Click in the red plus symbol on the upper right side of the screen.
- Give a sense-full name. Names must be lowercase and must not contain spaces (allowed characters: a-z, 0-9 and _).
- Don't bother about the device type, just confirm default selection. This will be adapt later in the code.
- Enter WiFi SSID, WiFi Password and, if you use, OTA access password.
- create your device configuration set by clicking in [SUBMIT]
- Ignore the flashing symbol "Select upload port", just scope on your yaml file and start editing by clicking in "EDIT". If you see a message like "404 file not found", click in another home assistant menu on the left and then back in ESPHome and you'll see the code which you can work with.
- Scroll down this page to "Basic Configuration", mark and copy the prepared code and paste it into your yaml file. Remember to adapt the following entries:
  - line 10: Set up the static ip for your device that matches to your environment. Remember this IP must be unique in your LAN.
  - lines 26, 27 and 28: gateway is the IP of your router, subnet most certainly 255.255.255.0 and dns1 again the IP of your router.
  - line 31: This is only if a red cross appears here. AP SSIDs can only contain up to 32 symbols. If you've chosen a long device name it might exceed. Either shorten the device name or delete right after AP, " (192.168.4.1)".
  - line 32: You'll probably don't want to complicate your live with a WiFi password when your bulb enters access point mode. Feel free to change from password: '1234abcd' to password: ''.
  - don't forget to hit [SAVE] and [CLOSE]
- Back in ESPHome dashboard, find your device and check the code by clicking in [VALIDATE]
- If you've copied and adapted right it will pass validation with success and you can close this dialog. You are now ready to compile your approved firmware.
- On the top right corner you'll find 3 horizontally stacked points. Click there and chose [Compile]. Give it up to 3 minutes time to do the job the first time until it confirms "INFO Successfully compiled program."
- On the lower right side, click in [DOWNLOAD BINARY] and store your firmware on your computer where you'll find it later. Don't change the file name.

You're ready to upload your firmware to the bulb. This is where we can say thanks to the amazing feature set of Theo Arends' tasmota firmware which allows to upload and install binary files. This is done only once, after this it'll be much easier uploading newer versions of the firmware over the air directly from ESPHome.

- Your bulb starts providing an open access point with WiFi name tasmota- followed by 4 numbers. Connect to this WiFi and let DHCP provide a suitable IP address on your computer automatically.
- Open your browser, enter 192.168.4.1 in the address bar and press enter; a captive portal will appear.
- Enter SSID and WiFi password of your home WiFi and confirm. The bulb will restart and try to access your home WiFi.
- If the access details where right, your bulb will integrate in your local network. If not, the bulb restarts as access point with captive portal after 1 minute unsuccessful trials. If that is the case, redo the procedure until it's OK.
- Open your router and seek for the IP address that your router has given with DHCP to your bulb. It should appear in the attached devices named tasmota- followed by 4 numbers.
- Now open this IP address with your browser, the tasmota dashboard will appear.
- Click in [Firmware Upgrade], in the following dialog on the lower part in [Browse] and navigate to the binary file you've created and downloaded from ESPHome, then hit [Start upgrade] and wait up to 2 minutes.

Turn back to ESPhome in home assistant and see your bulb coming online with the indicator changing from red Offline to green Online. Any further change to the firmware can now be done, compiled and uploaded over the air directly from here.

You can now integrate your bulb in home assistant using a lovelace light card, just select the good entity.

Enjoy your hard work and impress some people with the magic 8-]


## Basic Configuration

field for code goes here

   [aliexpress.com]: <https://www.aliexpress.com/item/33006613923.html>
   [this guide]: <https://www.digiblur.com/2019/11/tuya-convert-2-flash-tuya-smartlife.html>
