#!/bin/bash

mkdir -p /home/dietpi/rpi-dietpi-main/node-application/logs
cd /home/dietpi/rpi-dietpi-main/node-application
/usr/local/bin/node update_cloudflare.js
