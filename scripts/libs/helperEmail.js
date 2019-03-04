const nodemailer = require("nodemailer");

const sendEmail = async data => {
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

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendEmail
};
