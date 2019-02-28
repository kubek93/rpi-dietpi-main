const fetch = require("node-fetch");

const errorLog = require("./logger").errorlog;
const publicIp = require("public-ip");
const readFile = require("./files").readFile;
const successlog = require("./logger").successlog;
const writeFile = require("./files").writeFile;

const getPublicIP = async () => {
  try {
    const publicIP = await publicIp.v4();
    successlog.info(`[GET][publicIP] Current public IP Address: ${publicIP}`);
    return publicIP;
  } catch (err) {
    errorLog.error(`[GET][publicIP] ${err.toString()}`);
  }
};

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
        `[GET][getDnsRecords] Not found correct searched name in your zones.`
      );
    } else {
      errorLog.error(`[GET][getDnsRecords] ${data.toString()}`);
    }
  } catch (err) {
    errorLog.error(`[GET][getDnsRecords] ${err.toString()}`);
  }
};

const updateCloudFlareDnsData = async (currentIp, dnsRecord) => {
  try {
    const fileData = await readFile("./data/store.json");

    if (currentIp === fileData.lastIpAddress) {
      successlog.info(
        `[PUT][updateCloudFlareDnsData] both IP addresses are the same. Saved IP: ${fileData.lastIpAddress}. Current IP: ${currentIp}.`
      );
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
        successlog.info(
          `[PUT][updateCloudFlareDnsData] SUCCESS updated cloudflare IP Address. Old: ${
            fileData.lastIpAddress
          }. New: ${currentIp}.`
        );

        fileData.lastIpAddress = currentIp;
        await writeFile("./data/store.json", JSON.stringify(fileData));

        successlog.info(
          `[SAVE][updateCloudFlareDnsData] SUCCESS update store file for compare old and new ip address.`
        );
      } else {
        errorLog.error(`[PUT][updateCloudFlareDnsData] ${data.toString()}`);
      }
    }
  } catch (err) {
    errorLog.error(`[PUT][updateCloudFlareDnsData] ${err.toString()}`);
  }
};

module.exports = {
  getDnsRecords,
  getPublicIP,
  updateCloudFlareDnsData
};
