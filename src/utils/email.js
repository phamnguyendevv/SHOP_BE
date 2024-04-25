import nodemailer from 'nodemailer'

let emails = {
    checkEmail: async (email) => {
        try {
            const re = /\S+@\S+\.\S+/;
            return re.test(email);
        } catch (error) {
            throw error;
        }
    },
    // send email
    sendEmail: async (email, subject, text) => {
        console.log(email, subject, text)

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: email,
                clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
                clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
                refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
                accessToken: myAccessToken
            }
        });
        const mailOptions = {
            from: 'Shop web admin',
            to: email,
            subject: subject,
            text: text
        }
        try {
            const result = await transporter.sendMail(mailOptions)
            return result
        } catch (error) {
            throw new Error(error)
        }

    }
    // verify email


}

export default emails;