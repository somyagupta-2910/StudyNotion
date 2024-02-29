const User = require('../models/User');
require('dotenv').config();
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// resetPasswordToken - send reset password url to email
exports.resetPasswordToken = async(req, res) => {
    try{
        // get email from request body
        const email = req.body.email;

        // validate email
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                success: false,
                message: 'Your email is not registered with us',
            })
        }

        // generate token
        const token = crypto.randomUUID();
        // this token will be used to fetch that user in DB whose password needs to be updated

        // update user with the token in DB
        const updatedDetails = await User.findOneAndUpdate({email: email}, {
            token: token,
            resetPasswordExpires: Date.now() + 3600000,
        },
        {new: true});

        // generate a link to create new password
        const url = `http://localhost:3000/update-password/${token}`

        // send mail comprising the url
        await mailSender(email, 'Password Reset Link', `Your Link for email verification is ${url}. Please click this url to reset your password.`)

        return res.json({
            success: true,
            message: 'Email Sent Successfully',
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while resetting password',
        })
    }
}

// resetPassword - save new password in DB
exports.resetPassword = async(req,res) => {
    try{
        // fetch data
        const {password, confirmPassword, token} = req.body;

        // validate
        if(password != confirmPassword){
            return res.json({
                success: false,
                message: 'Passwords do not match',
            })
        }

        // get userDetails from db using token
        const userDetails = await User.findOne({token: token});

        // if no entry - invalid token
        if(!userDetails){
            return res.json({
                success: false,
                message: 'Token is invalid',
            })
        }

        // check if token has expired
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success: false,
                message: 'Token has expired, please regenrate your token',
            })
        }

        // hash password
        const hashedpassword = await bcrypt.hash(password, 10);

        // update password in DB
        await User.findOneAndUpdate(
            {token: token}, 
            {password: hashedpassword},
            {new: true},
        )

        return res.json({
            success: true,
            message: 'Password reset successfully',
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Error while resetting password',
        })
    }
}