import nodemailer from 'nodemailer';
import { IUser } from '../models/user';

export default class Email {
  to: string;
  firstName: string;
  url: string;
  from: string;

  constructor(user: IUser, url: string) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = process.env.EMAIL_USERNAME as string;
  }

  newTransport() {
    const port = Number(process.env.EMAIL_PORT) || 587;
    const secure = port === 465;  // ✅ Use secure SSL if port is 465

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port,
      secure,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(subject: string, message: string): Promise<void> {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: message
    };

    try {
      await this.newTransport().sendMail(mailOptions);
    } catch (e) {
      console.error('Email sending failed:', e);
    }
  }

  async sendWelcomeToApp(): Promise<void> {
    await this.send('Welcome to the PHC Portal', `Visit ${this.url} to verify your email`);
  }

  async sendPasswordReset(): Promise<void> {
    await this.send('PASSWORD RESET TOKEN', `Change your password here: ${this.url}`);
  }
}
