const nodemailer = require("nodemailer");
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = process.env.EMAIL_USERNAME;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject, message) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: message,
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
      `Welcome to the main PHC login page, visit ${this.url} to verify your email`
    );
  }

  async sendPasswordReset() {
    await this.send(
      "PASSWORD RESET TOKEN",
      `Change your password here: ${this.url}`
    );
  }
};
