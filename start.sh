cat /home/dietpi/rpi-dietpi-main/packages.txt | xargs sudo apt-get install -y
cd /home/dietpi/rpi-dietpi-main
cd node-application && npm install
cp example.env .env && nano .env
node update_cloudflare.js
cd ..
cp cron/* /var/spool/cron/crontabs/
# if we are in main folder check by pwd
rm -rf .git .gitignore cron/ # add start.sh and packages.txt
