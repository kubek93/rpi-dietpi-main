// Start file for cloudflare DNS changes

require('dotenv').config({ path: './.env' });

const Helpers = require('./libs/helpers');
const HelperNetwork = require('./libs/helperNetwork');
const schedule = require('node-schedule');

const main = async () => {
    const currentIp = await HelperNetwork.getPublicIP();
    const dnsRecord = await Helpers.getDnsRecords();

    await Helpers.updateCloudFlareDnsData(currentIp, dnsRecord);
};

(() => {
    const cronInterval = process.env.DNSCHANGER_CRON_INTERVAL;

    if (!cronInterval) {
        main();
    }

    schedule.scheduleJob(cronInterval, () => {
        main();
    });
})();
