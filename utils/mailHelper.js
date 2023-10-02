const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

async function sendMail(to, subject, text, html) {
    var mailOptions = {
        from: process.env.FROM_EMAIL,
        to: to,
        subject: subject,
        text: text,
        html: html
      };
      
      return await transporter.sendMail(mailOptions);
}

module.exports = sendMail;