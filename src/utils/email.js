
import nodemailer from "nodemailer";


// Khởi tạo transporter để gửi email
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: "phamtrungnguyenvx99@gmail.com",
    pass: "jquv uecu futl rocg",
  },
});




export const sendEmail = async (email, subject, text) => {

    const mailOptions = {
        from: "phamtrungnguyenvx99@gmail.com",
        to: email,
        subject: subject,
        html:text,
      };
      await transporter.sendMail(mailOptions);
};
