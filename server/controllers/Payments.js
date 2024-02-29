const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const crypto = require("crypto")
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const {courseEnrollmentEmail} = require('../mail/templates/courseEnrollmentEmail');
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const { default: mongoose } = require('mongoose');

// capture payment for multipole courses and intiate Razorpay porder
exports.capturePayment = async(req,res) => {
    // fetch courses and user id
    const {courses} = req.body;
    const userId = req.user.id;

    // validate course
    if(courses.length === 0){
        return res.json({
            success: false,
            message: 'Please provide valid course ID',
        })
    }

    let totalAmount = 0;

    // calculate total amount for all the courses in the cart
    for(const course_id of courses){
        let course;
        try{
            // fetch course from DB
            course = await Course.findById(course_id);

            if(!course){
                return res.status(200).json({
                    success: false,
                    message: 'Could not find the course',
                })
            }

            // convert userId which is in string format to an object Id format
            const uid = new mongoose.Types.ObjectId(userId);

            // check if student is already enrolled
            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).json({
                    success: false,
                    message: "Student is already Enrolled",
                })
            }

            // calculate total amount
            totalAmount += course.price;
        }
        catch(error){
            console.log(error)
            return res.status(500).json({ 
                success: false, 
                message: error.message 
            })
        }
    }

    // options object for Razorpay
    const options = {
        amount: totalAmount*100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    };

    try{
        // intitiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        return res.status(200).json({
            success: true,
            data: paymentResponse,
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({ 
            success: false, 
            message: 'Could not initiate order' 
        })
    }
}

// verify payment
exports.verifyPayment = async(req,res) => {
    
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature

    // fetch courses and user id
    const courses = req.body?.courses
    const userId = req.user.id

    // validate payment
    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
        return res.status(200).json({
            success: false,
            message: 'Payment Failed',
        })
    }

    // create a body
    let body = razorpay_order_id + "|" + razorpay_payment_id

    // create a hmac object
    const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

    // validate the signature
    if(expectedSignature == razorpay_signature){
        // Enroll student
        await enrollStudents(courses, userId, res)
    
        // return success
        return res.status(200).json({
            success: true,
            message: 'Payment Verified',
        });
    }

    
    // return failure
    return res.status(200).json({ 
        success: false, message: "Payment Failed" 
    })
}

exports.sendPaymentSuccessEmail = async (req, res) => {
    /// fetch order details and user id
    const { orderId, paymentId, amount } = req.body
  
    const userId = req.user.id
  
    // validate
    if (!orderId || !paymentId || !amount || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details" })
    }
  
    try {
        // fetch the student from DB
      const enrolledStudent = await User.findById(userId)
  
      // send email
      await mailSender(
        enrolledStudent.email,
        `Payment Received`,
        paymentSuccessEmail(
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
          amount / 100,
          orderId,
          paymentId
        )
      )
    } catch (error) {
        console.log("error in sending mail", error)
        return res.status(400).json({ 
            success: false, 
            message: "Could not send email" 
        })
    }
  }

// enroll student
const enrollStudents = async(userId, courses, res) => {
    // validate
    if(!userId || !courses){
        return res.status(200).json({
            success: false,
            message: 'Please provide valid user ID and course ID',
        })
    }

    // traverse through all the courses
    for(const courseId of courses){
        try{
            // enroll student to the course
            const enrolledCourse = await Course.findByIdAndUpdate(
                {_id: courseId},
                {
                    $push: {
                        studentsEnrolled: userId,
                    }
                },
                {new: true}
            )

            if(!enrolledCourse){
                return res.status(200).json({
                    success: false,
                    message: 'Could not enroll the student',
                })
            }

            // find the student and add the course to the student's list of courses
            const enrolledStudent = await User.findByIdAndUpdate(
                {_id: userId},
                {
                    $push: {
                        courses: courseId,
                    }
                },
                {new: true}
            )

            // send an email to the student once the course is enrolled
            // Send an email notification to the enrolled student
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(
                enrolledCourse.courseName,
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
                )
            )

            console.log("Email sent successfully: ", emailResponse.response)
        }
        catch(error){
            console.log(error)
            return res.status(500).json({ 
                success: false, 
                message: error.message 
            })
        }
    }
}