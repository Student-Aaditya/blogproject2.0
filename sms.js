const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sms(username) {
    try {
        const sms = await client.messages.create({
            body: `Hello ${username}, your signup was successful.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: "+918130424124" 
        });
        console.log('SMS sent successfully:', sms.sid);
    } catch (error) {
        console.error('Twilio Error:', error);
    }
}

module.exports = { sms };
