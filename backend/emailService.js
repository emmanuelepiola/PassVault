const nodemailer = require('nodemailer');

// Configurazione del trasportatore SMTP di Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendPasswordResetEmail(email, resetToken) {
  // Create the reset password URL
  const resetUrl = `http://localhost:3000/edit-password?token=${resetToken}`;
  
  // Send the email
  const info = await transporter.sendMail({
    from: '"PassVault Security" <passvault.noreply@gmail.com>',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #54A9DA;">Password Reset Request</h2>
        <p>You have requested to reset your password. Click the button below to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #54A9DA; 
                    color: white; 
                    padding: 12px 24px; 
                    text-decoration: none; 
                    border-radius: 25px;
                    display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If you didn't request this password reset, please ignore this email.
          The link will expire in 1 hour.
        </p>
        <hr style="border: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is an automated message from PassVault Security. Please do not reply to this email.
        </p>
      </div>
    `,
  });
  
  return info;
}

module.exports = {
  sendPasswordResetEmail,
}; 