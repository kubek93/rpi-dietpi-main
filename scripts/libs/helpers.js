const fetch = require("node-fetch");

const errorLog = require("./helperLogger").errorlog;
const successlog = require("./helperLogger").successlog;
const helperFiles = require("./helperFiles");
const helperEmail = require("./helperEmail");
const helperNetwork = require("./helperNetwork");

const getDnsRecords = async () => {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${
        process.env.CLOUDFLARE_ZONE_ID
      }/dns_records`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Email": process.env.CLOUDFLARE_USERNAME,
          "X-Auth-Key": process.env.CLOUDFLARE_KEY
        }
      }
    );
    const data = await response.json();
    if (data.success) {
      for (const dns of data.result) {
        if (dns.name.includes(process.env.CLOUDFLARE_SEARCH_NAME)) {
          return dns;
        }
      }
      errorLog.error(
        `[ERROR] - [GET][getDnsRecords] Not found correct searched name in your zones.`
      );
    } else {
      errorLog.error(`[ERROR] - [GET][getDnsRecords] ${data.toString()}`);
    }
  } catch (err) {
    errorLog.error(`[ERROR] - [GET][getDnsRecords] ${err.toString()}`);
  }
};

const updateCloudFlareDnsData = async (currentIp, dnsRecord) => {
  try {
    const fileData = await helperFiles.readFile("./data/store.json");

    if (currentIp === fileData.lastIpAddress) {
      successlog.info(`[SUCCESS - not saved] THE SAME IP! ${currentIp}`);
    } else {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${
          dnsRecord.zone_id
        }/dns_records/${dnsRecord.id}`,
        {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Email": process.env.CLOUDFLARE_USERNAME,
            "X-Auth-Key": process.env.CLOUDFLARE_KEY
          },
          body: JSON.stringify({
            type: dnsRecord.type,
            name: dnsRecord.name,
            content: currentIp
          })
        }
      );
      const data = await response.json();
      if (data.success) {
        const notifyText = `[PUT][updateCloudFlareDnsData] SUCCESS updated cloudflare IP Address. Old: ${
          fileData.lastIpAddress
        }. New: ${currentIp}.`;
        successlog.info(notifyText);

        fileData.lastIpAddress = currentIp;
        await helperFiles.writeFile(
          "./data/store.json",
          JSON.stringify(fileData)
        );
        await helperEmail.sendEmail(notifyText);
      } else {
        const errorMessage = `[ERROR] - [PUT][updateCloudFlareDnsData] ${data.toString()}`;
        helperEmail.sendEmail(errorMessage);
        errorLog.error(errorMessage);
      }
    }
  } catch (err) {
    const errorMessage = `[ERROR] - [PUT][updateCloudFlareDnsData] ${err.toString()}`;
    helperEmail.sendEmail(errorMessage);
    errorLog.error(errorMessage);
  }
};

module.exports = {
  getDnsRecords,
  getPublicIP: helperNetwork.getPublicIP,
  updateCloudFlareDnsData
};
