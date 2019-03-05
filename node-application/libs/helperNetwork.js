const publicIp = require("public-ip");

const getPublicIP = async () => {
  try {
    const addressPublicIP = await publicIp.v4();
    return addressPublicIP;
  } catch (err) {
    errorLog.error(`[ERROR] - [GET][addressPublicIP] ${err.toString()}`);
  }
};

module.exports = {
  getPublicIP
};
