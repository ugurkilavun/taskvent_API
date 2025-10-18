// Templates
// EN
import { emailVerificationTemplate_en } from "./templates/en/evTemplate_en";
// TR
import { emailVerificationTemplate_tr } from "./templates/tr/evTemplate_tr";
// Types
import { mailType } from "../../types/mails";

// * Email Verification Template Selector
export const evTemplateSelector = (lang: string): mailType => {
  switch (lang) {
    case "US":
      return { template: emailVerificationTemplate_en, subject: "Email Verification" };

    case "TR":
      return { template: emailVerificationTemplate_tr, subject: "E-posta Doğrulama" };

    default:
      return { template: emailVerificationTemplate_en, subject: "Email Verification" };
  };
};