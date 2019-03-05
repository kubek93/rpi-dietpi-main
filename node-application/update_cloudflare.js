require("dotenv").config({ path: "./.env" });

const Helpers = require("./libs/helpers");
const HelperNetwork = require("./libs/helperNetwork");

(async () => {
  const currentIp = await HelperNetwork.getPublicIP();
  const dnsRecord = await Helpers.getDnsRecords();

  await Helpers.updateCloudFlareDnsData(currentIp, dnsRecord);
})();
