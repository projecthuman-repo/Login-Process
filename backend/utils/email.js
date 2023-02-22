const nodemailer = require("nodemailer");
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = "shivamaeryy08@gmail.com";
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SEND_GRID_USERNAME,
          pass: process.env.SEND_GRID_PASSWORD,
        },
      });
    } else {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }

  async send(subject, message) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      // text: message,
      html: `<p>Welcome to the main PHC login page, visit <a href=${this.url}>here</a> to login</p>`,
    };
    try {
      await this.newTransport().sendMail(mailOptions);
    } catch (e) {
      console.log(e);
    }
  }

  async sendWelcomeToApp() {
    await this.send(
      "Welcome to the PHC Portal",
      `Welcome to the main PHC login page, visit ${this.url} to login`
    );
  }

  async sendPasswordReset() {
    await this.send(
      "PASSWORD RESET TOKEN",
      "Your token is Please reset your password at the following link: "
    );
  }
};
/* const sendEmail = async (options) => {
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
}; */
