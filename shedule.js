const cron = require('node-cron');
const {GetResult} = require('./Getdata')
function logMessage() {
 console.log('Cron job executed at:', new Date().toLocaleString());
}

// Schedule the cron job to run every minute
cron.schedule('*/1 * * * *', () => {
    logMessage();
    GetResult();
});