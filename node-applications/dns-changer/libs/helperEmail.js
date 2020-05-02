const nodemailer = require('nodemailer');
const errorLog = require('./helperLogger').errorlog;

const sendEmail = async data => {
    try {
        await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 587,
            secure: false,
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                user: process.env.EMAIL_AUTH_USER,
                pass: process.env.EMAIL_AUTH_PASS
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            subject: process.env.EMAIL_SUBJECT,
            html: data
        };

        return await transporter.sendMail(mailOptions);
    } catch (err) {
        const errorMessage = `[ERROR] - [sendEmail] ${err.toString()}`;
        errorLog.error(errorMessage);
    }
};

module.exports = {
    sendEmail
};
