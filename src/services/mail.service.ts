import dotenv from 'dotenv';
// Configs
import { gmailTransporter } from '../configs/mailTransporter.config';
// Mail
import { evTemplateSelector } from "./mail/utils";
// Types
import { mailType } from "../types/mails.type";
// Middlewares
import { logger } from "../middlewares/logger.middleware";

// .env config
dotenv.config({ quiet: true });

export const sendVerificationEmail = async ({ to, name, verificationUrl, lang }: { to: string, name: string, verificationUrl: string, lang: string }): Promise<void> => {
  // For performance
  const initialPeriod = performance.now();

  // Logger
  const logg2r = new logger();

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
    // Logger - RESPONSE
    logg2r.create({
      timestamp: new Date(),
      level: "AUDIT",
      logType: "mail",
      message: `Mail sent to ${to}`,
      service: "mail.service",
      username: name,
      durationMs: performance.now() - initialPeriod,
    }, { file: "mails", seeLogConsole: true });
  } catch (error) {
    // Logger - RESPONSE
    logg2r.create({
      timestamp: new Date(),
      level: "AUDIT",
      logType: "mail",
      message: `Mail could not be sent: ${to}`,
      service: "mail.service",
      username: name,
      durationMs: performance.now() - initialPeriod,
      details: {
        error: "MAILERROR",
        stack: `Error: ${error.stack}`
      }
    }, { file: "mails", seeLogConsole: true });
    throw error;
  }
};