const User = require('../models/User');
const Profile = require('../models/Profile');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { passwordUpdated } = require("../mail/templates/passwordUpdate")

// sendOTP
exports.sendotp = async(req, res) => {
    try{    
        //fetch email from request body
        const {email} = req.body;

        // check if user a;lready exists
        const checkIfUserExists = await User.findOne({email});

        // if user exists, return this response
        if(checkIfUserExists){
            return res.status(401).json({
                success: false,
                message: 'User already registered',
            })
        }

        // generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log('OTP generated: ', otp);

        // check if unique otp or not in the DB
        let result = await OTP.findOne({otp: otp});

        while(result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({otp: otp});
        }

        // create the entry of otp in DB
        const otpPayload = {email, otp};

        const otpBody = await OTP.create(otpPayload);

        // return successful response
        return res.status(200).json({
            success: true,
            message: 'OTP Sent successfully',
            otp,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// signUp
exports.signup = async(req,res) => {
    try{
        // fetch data from request body
        const {firstName, lastName, email, password, confirmPassword, accountType, otp} = req.body;

        // validate data
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            })
        }

        // match both the passwords
        if(password != confirmPassword){
            return res.status(400).json({
                success: false,
                message: 'Password and confirmPassword values do not match. Please try again'
            })
        }

        // check if user already exists or not
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }

        // find most recent otp for the user using their email and sorting and fetching the most recent otp
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);

        // if otp is not found, return failure
        if(recentOtp.length == 0){
            return res.status(400).json({
                success: false,
                message: 'OTP Not Found'
            })
        }
        else if(otp !== recentOtp[0].otp){
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: 'OTP does not match'
            })
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Password hashed');

        // create entry in DB
        // we create an empty Profile object for the new User.
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })

        console.log('Profile Created');

        // create User Object
        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`
        })

        console.log('user created');

        return res.status(200).json({
            success: true,
            message: 'User is registered successfully'
        })


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'User cannot be registered'
        })
    }
}

// login
exports.login = async(req,res) => {
    try{
        // fetch email and password
        const {email, password} = req.body;

        // validate
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: 'All fields are required, please try again'
            })
        }

        // check if user already exists
        const user = await User.findOne({email}).populate('additionalDetails');

        if(!user){
            return res.status(401).json({
                success: false,
                message: 'User is not registered. Please signup'
            })
        }

        // generate JWT, after password matches
        if(await bcrypt.compare(password, user.password)){
            // create payload
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            // create token
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2h',
            })

            user.token = token;
            user.password = undefined;

            // create cookie and send response
            const options = {
                expiresIn: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }
            res.cookie('token', token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'Logged in successfully',
            })
        }
        else{
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect'
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'User cannot be logged in'
        })
    }
}

// change password
exports.changePassword = async(req,res) => {
    try{
        // fetch user details
        const userDetails = await User.findById(req.user.id);

        const {oldPassword, newPassword} = req.body;

        // check if oldPassword matches the password in the DB
        if(await bcrypt.compare(oldPassword, userDetails.password)){
            // if yes, update password
            // hash new password
            const hashedPassword = bcrypt.hash(newPassword, 10);

            // Update user in DB
            const updatedUserDetails = await User.findByIdAndUpdate(
                req.user.id,
                {password: hashedPassword},
                {new: true},
            )

            // send email notification
            try {
                const emailResponse = await mailSender(
                  updatedUserDetails.email,
                  "Password for your account has been updated",
                  passwordUpdated(
                    updatedUserDetails.email,
                    updatedUserDetails.firstName
                  )
                )
                console.log("Email sent successfully:", emailResponse.response)
            }
            catch (error) {
                // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
                console.error("Error occurred while sending email:", error);
                return res.status(500).json({
                  success: false,
                  message: "Error occurred while sending email",
                  error: error.message,
                })
            }
          
            // Return success response
            return res.status(200).json({ 
                success: true, message: "Password updated successfully" 
            })
        }

        // if password does not match
        return res.status(401).json({ 
            success: false, message: "The password is incorrect" 
        })
    }
    catch(error){
        console.error("Error occurred while updating password:", error);
        return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
        })
    }
}