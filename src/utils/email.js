
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';


dotenv.config();



export const sendEmail = async (email, subject, text) => {
    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Configure mail options
    const mailOptions = {
        from: {
            name: "Pham Trung Nguyen",
            email: "Phamtrungnguyen2288@gmail.com",
        },
        to: email,
        subject: subject,
        text: text,
        mailSettings: {
            spamCheck: {
                enable: true,
                threshold: 1,
                postToUrl: 'https://example.com/post'
            }
        }
    };

    try {
        // Send email
        const result = await sgMail.send(mailOptions);
        console.log('Email sent:', result);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error("Error sending email");
    }
};
