# rpi-dietpi-main

System configuration for home's raspberry pi server - nextcloud, mariadb, adminer.

If you want to install node.js on dietpi.
dietpi-software install 9

Cron process
crontab -e
_/1 _ \* \* \* _ /bin/node /public/test.js
1 _ \* \* \* /usr/local/bin/node /media/rpi-dietpi-main/scripts/update_cloudflare.js

If you want to check where is node write:
which node

crontab -e

```
* * * * * sh /media/rpi-dietpi-main/cron.sh
```

cron.sh

```
#!/bin/bash

mkdir -p /media/rpi-dietpi-main/scripts/logs
cd /media/rpi-dietpi-main/scripts
/usr/local/bin/node update_cloudflare.js
```
