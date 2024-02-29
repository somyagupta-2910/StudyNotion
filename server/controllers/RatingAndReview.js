const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');
const { default: mongoose } = require('mongoose');

// create rating
exports.createRating = async(req,res) => {
    try{
        // get user id
        const userId = req.user.id;

        // fetch data
        const {rating, review, courseId} = req.body;

        // check if user is enrolled or not
        const courseDetails = await Course.findOne(
            {_id: courseId, studentsEnrolled: {$elemMatch: {$eq: userId}}},
        )

        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: 'Student is not enrolled in the course',
            })
        }

        // check if user has already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne(
            {
                user: userId, 
                course: courseId,
            }
        )

        if(alreadyReviewed){
            return res.status(403).json({
                success: false,
                message: 'User has already reviewed this course',
            })
        }

        // create review
        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId,
        })

        // add review id to the course
        const updatedCourseDetails = await Course.findById({_id: courseId},
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                }
            },
            {new: true}
        );

        console.log(updatedCourseDetails);

        return res.status(200).json({
            success: true,
            message: 'Review Created Successfully',
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

// get average ratings
exports.getAverageRating = async(req,res) => {
    try{
        // get course Id
        const courseId = req.body.courseId;

        // calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                // find all the ratings and reviews that have the given course id
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group: {
                    // all entries are grouped into one
                    _id: null,
                    // get average of all ratings
                    averageRating: {$avg: '$rating'},
                }
            }
        ])

        // return rating
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }

        // if no result, then return 0
        return res.status(200).json({
            success: true,
            message: 'Avergae Rating is Zero as no ratings are available till now.',
            averageRating: 0,
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

// get all ratings of all the courses on the app
exports.getAllRating = async(req,res) => {
    try{
        const allReviews = RatingAndReview.find({})
        .sort({rating: 'desc'})
        .populate({
            path: 'user',
            select: 'firstName lastName email image',
        })
        .populate({
            path: 'course',
            select: 'courseName',
        })
        .exec();

        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            data:allReviews,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}