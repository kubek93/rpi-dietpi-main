# rpi-dietpi-main

For using this project you should own:

- Network connection with public IP.

## Applications

### Node Applications

- `dns-changer` Application for update dynamic IP address and convert it to correct subdomain in cloudflare platform using external API

## Usage (auto-installation):

## Manual installation:

Follow with instructions:

### 1. Download [DietPi](https://dietpi.com) OS.

> DietPi is a extremely lightweight Debian OS. With images starting at 400MB, thats 3x lighter than 'Raspbian Lite'.


### 2. Format SD card and Flash OS image using [balenaEtcher](https://www.balena.io/etcher/)

> The Raspberry Pi's bootloader, built into the GPU and non-updateable, only has support for reading from FAT filesystems (both FAT16 and FAT32), and is unable to boot from an exFAT filesystem.

#### MAC OS:
```
$ diskutil list
$ diskutil unmountDisk disk2
$ diskutil eraseDisk FAT32 RPI /dev/disk2
```
<u>OPTIONAL</u> (if needed):
```
$ diskutil mountDisk /dev/disk2
```

### 3. <u>OPTIONAL</u>: If you want connect rapberry pi using wi-fi

#### Open card fiels using vscode
```
$ code /Volumes/boot/dietpi.txt
```
and change value for ```AUTO_SETUP_NET_WIFI_ENABLED``` from ```0``` to ```1```

#### Add settings for connect with you wi-fi network

```
$ code /Volumes/boot/dietpi-wifi.txt
```
these two configs are the most important for you
```
aWIFI_SSID[0]='WIFI_NAME'
aWIFI_KEY[0]='WIFI_PASSWORD'
```

### 4. Now you can log in to your new system and configure settings

1. Firstly, find an IP address loggin into your router and findind `DietPi` host name

2. Log in into DietPi system

> DietPi has two accounts by default "root" and "dietpi". On first boot, both share the global password "dietpi", respectively the one set in "dietpi.txt".

```
$ ssh root@ip_address_of_dietpi_machine
$ apt-get update
$ apt-get upgrade
```

3. Finish configuration after first loggin

4. Install git.

```
$ apt-get install -y git
$ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
$ apt-get install -y nodejs
```

5. Install project locally and run bash script.

```
$ git clone https://github.com/kubek93/rpi-dietpi-main.git /home/dietpi/rpi-dietpi-main
$ sh /home/dietpi/rpi-dietpi-main/start.sh
```

6. Install docker
```
$ curl -fsSL https://get.docker.com -o /home/dietpi/get-docker.sh
$ sh /home/dietpi/get-docker.sh
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

#### Docker

```
// Run docker-compose with rebuild all containers
$ docker-compose up --build -d
$ docker-compose up --build --force-recreate -d

// Show logs
$ docker-compose logs

// To stop all containers
$ docker-compose stop
$ docker container stop $(docker container ls -aq)

// Remove all images with force
$ docker rmi $(docker images -a -q) -f
```

#### Verdaccio

```
$ docker exec -it {ID} /bin/bash
and
$ tail -f /var/log/apache2/verdaccio-access.log
```

#### Linux
```
which node      : where node is located
```

#### DietPi

```
dietpi-launcher : All the DietPi programs in one place.
dietpi-config   : Feature rich configuration tool for your device.
dietpi-software : Select optimized software for installation.
htop            : Resource monitor.
cpu             : Shows CPU information and stats.
 ```

## TODO

- [ ] Change ngnix reverse proxy with traefik

## To install
- [x] Docker
- [x] Verdaccio
- [x] pm2
- [x] dns-changer
- [ ] Fix nodemailer
- [ ] Nginx (nginx-proxy?) configuration and DNS domains cloudflare
- [ ] HDD configuration
- [ ] RPI configuration
- [ ] GitLab
- [ ] NextCloud (mysql + phpmyadmin or adminer)
- [ ] Homebridge (homekit)
- [ ] OpenVPN
- [ ] Backup system (rclone?)
- [ ] Splunk + Grafana
- [ ] Own self-hosted page
- [ ] luxbot
- [ ] mail about every attemption to ssh
- [ ] freeNAS
- [ ] pihole (DNS checker)

