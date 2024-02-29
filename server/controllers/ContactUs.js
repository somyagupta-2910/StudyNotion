const mailSender = require('../utils/mailSender');
const {contactUsEmail} = require('../mail/templates/contactFormRes');

exports.contactUsController = async (req, res) => {
    // fetch data from req.body
    const { email, firstname, lastname, message, phoneNo, countrycode } = req.body;

    console.log(req.body);


    try{
        // send email with nodemailer
        // params: to, subject, html
        const emailRes = await mailSender(
            email,
            'Your Data has been sent successfully',
            contactUsEmail(firstname, lastname, email, message, phoneNo, countrycode)
        )
        console.log(emailRes);

        // return response
        return res.json({
            success: true,
            message: "Email send successfully",
          })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}