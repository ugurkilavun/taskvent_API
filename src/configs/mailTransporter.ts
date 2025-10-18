import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// .env config
dotenv.config({ quiet: true });

// Gmail
export const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});