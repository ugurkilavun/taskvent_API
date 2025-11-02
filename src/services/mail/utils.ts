// Templates
// EN
import { emailVerificationTemplate_en } from "./templates/en/ev.template.en";
import { forgotPasswordTemplate_en } from "./templates/en/fp.template.en";
// TR
import { emailVerificationTemplate_tr } from "./templates/tr/ev.template.tr";
import { forgotPasswordTemplate_tr } from "./templates/tr/fp.template.tr";
// Types
import { mailType } from "../../types/mails.type";

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

// * Forgot Password Template Selector
export const fpTemplateSelector = (lang: string): mailType => {
  switch (lang) {
    case "US":
      return { template: forgotPasswordTemplate_en, subject: "Password reset" };

    case "TR":
      return { template: forgotPasswordTemplate_tr, subject: "Şifre Sıfırlama" };

    default:
      return { template: forgotPasswordTemplate_en, subject: "Reset password" };
  };
};