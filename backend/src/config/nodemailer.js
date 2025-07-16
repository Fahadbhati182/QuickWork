import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "2024.mohd.bhati@ves.ac.in",
    pass: "idarznbxaimdrbah",
  },
});

export const sendEmail = async (toString, subject, text) => {
  try {
    const mailOptions = {
      from: "2024.mohd.bhati@ves.ac.in",
      to: toString,
      subject: subject,
      text: text,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};
