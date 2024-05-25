<<<<<<< HEAD
const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  //1 create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
    },
  });
  //2 define email options
  const mailOptions = {
    from: 'Shelep Olha <shelep.olya@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3 send the email with nodemailer
  await transporter.sendMail(mailOptions);
};
module.export = sendEmail;
=======
const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  //1 create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
    },
  });
  //2 define email options
  const mailOptions = {
    from: 'Shelep Olha <shelep.olya@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3 send the email with nodemailer
  await transporter.sendMail(mailOptions);
};
module.export = sendEmail;
>>>>>>> 35b1c170158d3d3d55ec132a50c3b97ec1117b0a
