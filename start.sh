cat /home/dietpi/rpi-dietpi-main/packages.txt | xargs sudo apt-get install -y
cd /home/dietpi/rpi-dietpi-main
cd node-application && npm install
cp example.env .env && nano .env
