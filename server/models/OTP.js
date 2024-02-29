const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60*1000,
    }
});

// sending otp mail
async function sendVerificationEmail(email, otp){
    try{
        const mailResponse = await mailSender(email, 'Verification Email from StudyNotion', emailTemplate(otp));
        console.log('Email Sent Successfully', mailResponse);
    }
    catch(error){
        console.log('Error occured while sending mails: ', error);
        throw error;
    }
}

// pre-middleware (pre-save hook)
otpSchema.pre('save', async function(next) {
    // Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
    next(); // go to next middleware
})

module.exports = mongoose.model('OTP', otpSchema);