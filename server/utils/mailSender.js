const nodemailer = require('nodemailer');

// utility function to send emails
// it takes emailid, title of mail and body of email as the parameters
const mailSender = async(email, title, body) => {
    try{
        // create the nodemailer transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        // send an email using transporter's senMail function
        let info = await transporter.sendMail({
            from: 'StudyNotion',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })
        console.log(info);
        return info;
    }
    catch(error){
        console.log(error.message);
    }
}

module.exports = mailSender;