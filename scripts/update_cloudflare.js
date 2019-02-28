require('dotenv').config({path: './.env'});;

const Helpers = require('./libs/helpers');

(async () => {
  const currentIp = await Helpers.getPublicIP();
  const dnsRecord = await Helpers.getDnsRecords();

  await Helpers.updateCloudFlareDnsData(currentIp, dnsRecord);
})()
