const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Shivam Aery <hello@shivam.io>",
    to: options.email,
    subject: options.email,
    text: options.message,
    //html: <b>options.message</b>,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
