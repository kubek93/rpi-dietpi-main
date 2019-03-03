#!/bin/bash

mkdir -p /media/rpi-dietpi-main/scripts/logs
cd /media/rpi-dietpi-main/scripts
/usr/local/bin/node update_cloudflare.js
