import nodemailer from 'nodemailer';

export const sendEmail = async ({ email, subject, html }) => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: `Fresh Cart E-Commerce < ${process.env.EMAIL_USERNAME} >`,
        to: email,
        subject,
        html,
    };

    // 3) send the email
    const sendEmail = await transporter.sendMail(mailOptions);
    return sendEmail.accepted.length < 1 ? false : true;
};
