
const fetch = require("node-fetch");
const publicIp = require("public-ip");

const errorLog = require('./logger').errorlog;
const successlog = require('./logger').successlog;

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
      `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records`,
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
      errorLog.error(`[GET][getDnsRecords] Not found correct searched name in your zones.`);
    } else {
      errorLog.error(`[GET][getDnsRecords] ${data.toString()}`);
    }
  } catch (err) {
    errorLog.error(`[GET][getDnsRecords] ${err.toString()}`);
  }
};

const updateCloudFlareDnsData = async (currentIp, lastIpAddress, dnsRecord) => {
  if (currentIp === lastIpAddress) {
    successlog.info(`[PUT][updateCloudFlareDnsData] both IP addresses are the same: currentIp: ${currentIp} lastIpAddress: ${lastIpAddress}`);
  } else {
    try {
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
      if(data.success) {
        successlog.info(`[PUT][updateCloudFlareDnsData] ${JSON.stringify(data)}`);
      } else {
        errorLog.error(`[PUT][updateCloudFlareDnsData] ${data.toString()}`);
      }
    } catch (err) {
      errorLog.error(`[PUT][updateCloudFlareDnsData] ${err.toString()}`);
    }
  }
};

module.exports = {
  getDnsRecords,
  getPublicIP,
  updateCloudFlareDnsData
};
