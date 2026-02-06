import nodemailer from "nodemailer";
import { getRequiredEnv } from "../utils";

const transporter = nodemailer.createTransport({
  host: getRequiredEnv("AGQL_BE_GMX_HOST") as string,
  port: Number(getRequiredEnv("AGQL_BE_GMX_PORT")),
  secure: false,
  auth: {
    user: getRequiredEnv("AGQL_BE_GMX_USERNAME") as string,
    pass: getRequiredEnv("AGQL_BE_GMX_PASSWORD") as string,
  },
});

export async function sendEmail(to: string, confirmationCode: string) {
  try {
    const info = await transporter.sendMail({
      from: getRequiredEnv("AGQL_BE_GMX_USERNAME") as string,
      to,
      subject: `Ally GraphQL Application: Confirmation Code`,
      html: `<p>Your confirmation code is: ${confirmationCode}</p>`,
    });

    console.log(`✅ Email sent: ${info.messageId}`);
  } catch (err) {
    console.error(`❌ Failed to send email:`, err);
  }
}
