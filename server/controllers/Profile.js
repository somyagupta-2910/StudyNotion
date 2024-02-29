const Profile = require('../models/Profile');
const User = require('../models/User');
const Course = require("../models/Course");
const mongoose = require("mongoose");
const CourseProgress = require("../models/CourseProgress");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// update profile since we already create a dummy profile while creating User in the user controller
exports.updateProfile = async(req,res) => {
    try{
        // fetch data
        const {
            firstName = "",
            lastName = "",
            dateOfBirth = "",
            about = "",
            contactNumber = "",
            gender = "",
          } = req.body

        // get user id
        const id = req.user.id;

        // find profile
        // get userDetails so as to get profile id from it
        const userDetails = await User.findById(id);
        // get profile id from userDetails
        const profileId = userDetails.additionalDetails;

        // update user details
        if(firstName !== ""){
            const user = await User.findByIdAndUpdate(id, {
                firstName,
            });
            await user.save();
        }
        if(lastName !== ""){
            const user = await User.findByIdAndUpdate(id, {
                lastName,
            });
            await user.save();
        }

        // get profile details from Profile DB using Profile ID
        const profileDetails = await Profile.findById(profileId);

        // update profile in DB
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        // save the updates in DB
        await profileDetails.save();

        // Find the updated user details
        const updatedUserDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec()

        return res.json({
            success: true,
            message: "Profile updated successfully",
            updatedUserDetails,
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            error: error.message,
        })
    }
}

// fetch all details of a user
exports.getAllUserDetails = async (req, res) => {
    try {
        // fetch user id 
        const id = req.user.id;

        // fetch user details using user id
        const userDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec();

        console.log(userDetails);

        // return response
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: userDetails,
        })
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
  }

// deleteAccount
exports.deleteAccount = async(req,res) => {
    try{
        // fetch data
        const userId = req.user.id;

        // get user details ussing Id
        const userDetails = await User.findById({_id: userId});

        // validate, if user exists or not
        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // delete profile using profile id from userDetails
        await Profile.findByIdAndDelete({_id: new mongoose.Types.ObjectId(userDetails.additionalDetails)});

        // remove user from students enrolled section of courses
        // for (const courseId of userDetails.courses) {
        //     // loop through all the courses in which the user is enrolled
        //     await Course.findByIdAndUpdate(
        //       courseId,
        //       { $pull: { studentsEnroled: userId } },
        //       { new: true }
        //     )
        //   }

        // delete user from DB
        await User.findByIdAndDelete({_id: userId});

        // delete course progress of the user
        //await CourseProgress.deleteMany({ userId: id });


        // return response
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
          })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// update display picture
exports.updateDisplayPicture = async(req,res) => {
    try{
        // fetch data
        const userId = req.user.id;
        const displayPicture = req.files.displayPicture;

        if(!displayPicture){
            return res.status(404).json({
                success: false,
                message: 'Picture Not Uploaded'
            })
        }

        // upload image to cloudinary
        const image = await uploadImageToCloudinary(displayPicture, process.env.FOLDER_NAME, 1000, 1000);

        // update User Db with the cloudinary url
        const updatedUserDetails = await User.findByIdAndUpdate(
            {_id: userId},
            {image: image.secure_url},
            {new: true},
        )

        // rteurn response
        res.status(200).json({
            success: true,
            message: 'Image Uploaded successfully',
            data: updatedUserDetails,
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

exports.getEnrolledCourses = async (req, res) => {
    try {
        console.log('API Call Entered')
        // fetch user id
        const userId = req.user.id

        // fetch user details with courses
        let userDetails = await User.findOne({
            _id: userId,
        })
            .populate({
            path: "courses",
            populate: {
                path: "courseContent",
                populate: {
                path: "subSection",
                },
            },
            })
            .exec()

        // convert object to normal json
        userDetails = userDetails.toObject()

        // loop through all the courses
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0
            SubsectionLength = 0

            // loop through all the course content
            for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
            totalDurationInSeconds += userDetails.courses[i].courseContent[
                j
            ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
            userDetails.courses[i].totalDuration = convertSecondsToDuration(
                totalDurationInSeconds
            )
            SubsectionLength +=
                userDetails.courses[i].courseContent[j].subSection.length
            }

            // calculate progress percentage
            let courseProgressCount = await CourseProgress.findOne({
            courseID: userDetails.courses[i]._id,
            userId: userId,
            })
            courseProgressCount = courseProgressCount?.completedVideos.length


            if (SubsectionLength === 0) {
            userDetails.courses[i].progressPercentage = 100
            } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2)
            userDetails.courses[i].progressPercentage =
                Math.round(
                (courseProgressCount / SubsectionLength) * 100 * multiplier
                ) / multiplier
            }
        }
    
        // return response 
        if (!userDetails) {
            return res.status(400).json({
            success: false,
            message: `Could not find user with id: ${userDetails}`,
            })
        }

        // return response
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }