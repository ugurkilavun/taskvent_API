import { gmailTransporter } from '../configs/mailTransporter';
import dotenv from 'dotenv';
// Mail
import { evTemplateSelector } from "./mail/utils";
// Types
import { mailType } from "../types/mails";

// .env config
dotenv.config({ quiet: true });

export const sendVerificationEmail = async (to: string, name: string, verificationUrl: string, lang: string) => {
  try {
    const { template, subject }: mailType = evTemplateSelector(lang);

    const htmlTemplate: any =
      template.replace("{{name}}", name)
        .replace("{{verificationUrl}}", verificationUrl)
        .replace("{{year}}", new Date().getFullYear().toString())
        .replace("{{appName}}", "Taskvent");

    await gmailTransporter.sendMail({
      from: `Taskvent ${process.env.GMAIL_USER}`,
      to,
      subject,
      html: htmlTemplate,
    });
    console.log(`📨 Mail sent to ${to}`);
  } catch (error) {
    console.error('❌ Mail error:', error);
    throw error;
  }
};