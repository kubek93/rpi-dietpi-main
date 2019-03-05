# rpi-dietpi-main

For using our project you should own:

- raspberry pi
- public IP address
- internet connection

## Installation

Follow with instructions:

1. Download [DietPi](https://dietpi.com) OS.

   > DietPi is a extremely lightweight Debian OS. With images starting at 400MB, thats 3x lighter than 'Raspbian Lite'.

2. Flash OS images to SD cards using [balenaEtcher](https://www.balena.io/etcher/).

3. Now you need login to your new system. Firstly generate a new ssh key.

```
ssh-keygen -R hostname
ssh root@hostname
apt-get update
apt-get upgrade
```

3. Install git.

```
apt-get install git
```

4. Install project locally and run bash script.

```
git clone https://github.com/kubek93/rpi-dietpi-main.git /home/dietpi/rpi-dietpi-main && sh /home/dietpi/rpi-dietpi-main/start.sh
```

## Good to know (not required)

### Crone process

Path to cron files:

```
/var/spool/cron/crontabs
```

Cron root file:

```
* * * * * sh /home/dietpi/rpi-dietpi-main/cron-scripts/cron.sh
```

Cron scripts for root file:

```
#!/bin/bash

mkdir -p /home/dietpi/rpi-dietpi-main/node-application/logs
cd /home/dietpi/rpi-dietpi-main/node-application
/usr/local/bin/node update_cloudflare.js

```

If you want to view cron process for current user use command: `crontab -e`

### Usefull commands

- `which node` - where node is located
