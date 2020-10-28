# rpi-home-server

## Preconditions

For see your raspberry from external network you should have:
- Static IP for you RPI in router configuration
- Forward ports to be visible from outside
- Public IP address - sometimes network providers collect additionall money for this service.

## Manual installation:

Follow with instructions:

### 1. Download [DietPi](https://dietpi.com) OS.

> DietPi is a extremely lightweight Debian OS. With image 3x lighter than 'Raspbian Lite'.

### 2. Format SD card

> The Raspberry Pi's bootloader, built into the GPU and non-updateable, only has support for reading from FAT filesystems (both FAT16 and FAT32), and is unable to boot from an exFAT filesystem.

#### MAC OS:
```
# diskutil list
# diskutil unmountDisk disk2
# diskutil eraseDisk FAT32 RPI /dev/disk2
```
<u>OPTIONAL</u> (if needed):
```
# diskutil mountDisk /dev/disk2
```

### 3. Flash OS image using [balenaEtcher](https://www.balena.io/etcher/)

Choose downloaded dietPi image and select correct disk and click `Flash!`

### 4. Connect your rapberry pi to the Internet

#### LAN

Just connect you RPI using ethernet cable.

#### Wi-Fi

From flashed sd card:

- Open file `/boot/dietpi.txt` and provide settings to the network

```
aWIFI_SSID[0]='WIFI_NAME'
aWIFI_KEY[0]='WIFI_PASSWORD'
```

- Open file `/boot/dietpi.txt` and change setting `0` with `1` for line

```
AUTO_SETUP_NET_WIFI_ENABLED=0
```

- Open file `/boot/config.txt` and change setting `1` with `2` or more for line `(optional)`

```
change max_usb_current=2
```

### 5. Turn on RPI

Put your configured sd card to RPI and connect power supply

### 6. Log in to your configured device and setup required packages

- Check IP number of device finding `DietPi` as a hosts name in your router

- Log in to your RPI

> DietPi has two accounts by default "root" and "dietpi". On first boot, both share the global password "dietpi", respectively the one set in "dietpi.txt".

First log in updating whole system and can take few minutes

```
# ssh root@ip_address_of_dietpi_machine
# apt-get update
# apt-get upgrade
```

Install dependences (git|docker)
```
# apt-get install -y git
# curl -fsSL https://get.docker.com -o /home/dietpi/get-docker.sh
# sh /home/dietpi/get-docker.sh
# apt-get install -y docker-compose
```

### 7. Clone this project from github and update all environments variables

Clone project

```
# git clone https://github.com/kubek93/rpi-home-server.git /home/dietpi/rpi-home-server
```
`IMPORTANT:` Fill required variables for cloudflare, samba, etc.
Update all envs in `docker-compose.yml` file

```
// For node application
DNSCHANGER_CRON_INTERVAL: '* * * * *'
DNSCHANGER_CLOUDFLARE_USERNAME: 1234
DNSCHANGER_CLOUDFLARE_KEY: 1234
DNSCHANGER_CLOUDFLARE_SEARCH_NAME: 1234
DNSCHANGER_CLOUDFLARE_ZONE_ID: 1234

// For samba
// unsupported now
GLOBAL1: 'access based share enum = yes'
USER1: 'adminUser;admin'
SHARE1: 'public;/samba/anonymous'
SHARE2: 'admin;/samba/admin;yes;no;no;adminUser'
```

### 8. Run project using `docker-compose`

```
# cd /home/dietpi/rpi-home-server
# docker-compose up --build --force-recreate -d
```

## Tips & Tricks

### External Disks and devices (based on my case)

> The easiest way to do this is the following:
> Open dietpi_launcher, go to DietPi-Drive_Manager and select the external drive. There you will find the the option "Select to transfer DietPi user data to this drive". When you check this option the folder dietpi_userdata, including Nextcloud data, will be moved to the external disk.
https://dietpi.com/phpbb/viewtopic.php?t=673

- format pendrive and external disk on mac os using HFS+ type and MRB
- mount devices
```
lsblk
mount /dev/sda2 /mnt/external-sd
mount /dev/sdb2 /mnt/external-hdd
```

### Edit hosts file

For easier log in to rpi in you local network edit file `/etc/hosts` adding easy to remember name for your rpi ip address

## TODO

### Configuration
- [x] Use Docker instead of DietPi configurations
- [x] Change cron jobs with node-schedule package
- [x] Auto-mount external devices (pendrive and hdd disk in my case)
- [ ] Set up reverse nginx proxy
- [ ] Change ngnix reverse proxy with traefik
- [ ] Create script for configure device withour manually installations
- [ ] HDD configuration
- [ ] Own self-hosted page with documentation

### Programs
- [x] dns-changer
- [x] pm2
- [x] Verdaccio
- [ ] pihole - https://filterlists.com/
- [ ] Portainer
- [ ] Fail2Ban
- [ ] CertBot
- [ ] CloudPrint or OctoPrint
- [ ] Nginx (nginx-proxy?) configuration and DNS domains cloudflare
- [ ] Fix nodemailer
- [ ] GitLab
- [ ] NextCloud (mysql + phpmyadmin or adminer)
- [ ] Homebridge (homekit)
- [ ] OpenVPN
- [ ] Backup system (rclone?)
- [ ] Splunk + Grafana
- [ ] luxbot
- [ ] E-mail about every attemption to ssh
- [ ] freeNAS
- [ ] pihole (DNS checker)

## For developers

### Usefull commands

#### Docker

Run docker-compose with rebuild all containers:

```
# docker-compose up --build -d
# docker-compose up --build --force-recreate -d
```

Show logs:
```
# docker-compose logs
```

Stop all containers:
```
# docker-compose stop
# docker container stop $(docker container ls -aq)
```

Remove all images with force:
```
# docker rmi $(docker images -a -q) -f
```

#### Verdaccio

```
# docker exec -it {ID} /bin/bash
and
# tail -f /var/log/apache2/verdaccio-access.log
```

#### Linux

##### General

```
which node      : where node is located
lsb_release -a  : verfion of linux
```

##### Disk management

```
dietpi-drive_manager                : Program for manage disks
fdisk -l                            : list of mount disks
df -h                               : list of mount disks
blkid -o list                       : table of mounted disks
lsblk                               : show disk with partitions
umount /mnt/folder_name             : unmount folder from system
mount /dev/sda2 /mnt/folder_name    : mount external device to folder
hdparm -W0 /dev/sdg                 : check if disk is in usage
```

##### DietPi

```
dietpi-drive_manager    : Program for manage disks
dietpi-launcher         : All the DietPi programs in one place.
dietpi-config           : Feature rich configuration tool for your device.
dietpi-software         : Select optimized software for installation.
htop                    : Resource monitor.
cpu                     : Shows CPU information and stats.
dmesg                   : System alerts (?)
 ```

## Problems appeared

1. Unable to modify any file after run dietPi-Drive_Manager

https://github.com/MichaIng/DietPi/issues/3511
https://github.com/MichaIng/DietPi/commit/1570e47acac88414ecc8586845f24e70fb38461b

2. HDD disk is moutning as read only
```
dmesg | grep sdb
```
Shows that `Write Protect is off` we can remove it using `hdparm -r0 /dev/sdb`.

It doesn't help with this situation and problem sill oqqured.

Searching documentation of dietpi I found that users using more than one device from USB should change option for it.

Open file `config.txt` and set up `change max_usb_current=2`

3. Unable to run Verdaccio

```
root@DietPi:/home/dietpi/rpi-home-server# docker logs verdaccio
standard_init_linux.go:211: exec user process caused "exec format error"
```
