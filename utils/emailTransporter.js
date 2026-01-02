// // utils/emailTransporter.js
// const nodemailer = require('nodemailer');

// const createTransporter = () => {
//   const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
//   if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
//     console.warn('SMTP env vars missing — emails will not be sent');
//     return null;
//   }

//   return nodemailer.createTransport({
//     host: SMTP_HOST,
//     port: Number(SMTP_PORT),
//     secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
//     auth: {
//       user: SMTP_USER,
//       pass: SMTP_PASS,
//     },
//   });
// };

// const sendWelcomeEmail = async ({ to, name }) => {
//   const transporter = createTransporter();
//   if (!transporter) {
//     console.log(`Skipping email to ${to} — transporter not configured`);
//     return;
//   }

//   const from = process.env.FROM_EMAIL || 'no-reply@example.com';
//   const subject = 'Welcome to AIBAIK!';
//   const html = `
//     <div style="font-family: Arial, sans-serif; line-height:1.4">
//       <h2 style="color:#c0262e">Welcome, ${name}!</h2>
//       <p>Thanks for creating an account at AIBAIK. We're excited to have you.</p>
//       <p>If you need help, reply to this email.</p>
//       <hr />
//       <p style="font-size:12px;color:#666">AIBAIK</p>
//     </div>
//   `;

//   await transporter.sendMail({
//     from,
//     to,
//     subject,
//     html,
//   });
// };

// module.exports = { createTransporter, sendWelcomeEmail };


import nodemailer from "nodemailer";

function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP env vars missing — emails will not be sent");
    return null;
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for 465
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendEmail({ to, subject, html }) {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`Skipping email to ${to} — transporter not configured`);
    return;
  }
  const from = process.env.FROM_EMAIL || "no-reply@example.com";
  return transporter.sendMail({ from, to, subject, html });
}

export async function sendWelcomeEmail({ to, name }) {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.4">
      <h2 style="color:#c0262e">Welcome, ${name}!</h2>
      <p>Thanks for creating an account at AIBAIK. We're excited to have you.</p>
      <p>If you need help, reply to this email.</p>
    </div>
  `;
  return sendEmail({ to, subject: "Welcome to AIBAIK!", html });
}
