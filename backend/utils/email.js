/**
 * @module email
 * @const nodemailer
 * @requires nodemailer
 */
const nodemailer = require("nodemailer");
/**
 * @class
 * @public
 * @constructor
 */
module.exports = class Email {
  constructor(user, url) {
    /** @type {string} */
    this.to = user.email;
    /** @type {string} */
    this.firstName = user.firstName;
    /** @type {string} */
    this.url = url;
    /** @type {string} email address to send emails from */
    this.from = process.env.EMAIL_USERNAME;
  }
  /**
   * Creates transporter for nodemailer to send emails using specified email address and password
   * @function
   * @returns {Object} transporter for nodemailer
   */
  newTransport() {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL/TLS
    auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
    });
  }
  /**
   * Customize subject and message of email
   * @param {string} subject
   * @param {string} message
   * @function
   * @return {undefined}
   */
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
  /**
   * Send welcome to app message for verifying of email
   * @function
   * @return {undefined}
   */
  async sendWelcomeToApp() {
    await this.send(
      "Welcome to the PHC Portal",
      `Welcome to the main PHC login page, visit ${this.url} to verify your email`
    );
  }
  /**
   * Send password reset email
   * @function
   * @return {undefined}
   */
  async sendPasswordReset() {
    await this.send(
      "PASSWORD RESET TOKEN",
      `Change your password here: ${this.url}`
    );
  }
};
