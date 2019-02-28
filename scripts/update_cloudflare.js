const dotenv = require('dotenv');
const result = dotenv.config({path: './.env'});

const Helpers = require('./libs/helpers');
const store = require('./data/store.json');

(async () => {
  const currentIp = await Helpers.getPublicIP();
  const dnsRecord = await Helpers.getDnsRecords();
  const lastIpAddress = store.lastIpAddress;

  await Helpers.updateCloudFlareDnsData(currentIp, lastIpAddress, dnsRecord);
})()
