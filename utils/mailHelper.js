const twilio = require('twilio'),
      nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  service: 'outlook',
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
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}

// var client = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

// async function sendMessage(to, body) {
//     return await client.messages.create({
//         to: to,
//         from: process.env.TWILIO_PHONE,
//         body: body
//     });
// }


module.exports = sendMail;