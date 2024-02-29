const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/imageUploader');
//const CourseProgress = require("../models/CourseProgress");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");


// create Courses Handler function
exports.createCourse = async(req, res) => {
    try{
        // fetch data

        let {courseName, courseDescription, whatYouWillLearn, price, category, status, tag} = req.body;

        // get thumbnail image from request files
        const thumbnail = req.files.thumbnailImage;

        // Check if any of the required fields are missing
        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag.length ||
            !thumbnail ||
            !category
        ) {
            return res.status(400).json({
            success: false,
            message: "All Fields are Mandatory",
            })
        }

        // if status is not given, it means  the course is till being created
        if(!status || status == undefined){
            status='Draft';
        }

        // check for instructor
        const userId = req.user.id;
        console.log(userId);

        const instructorDetails = await User.findById(userId, {
            accountType: "Instructor",
          })

        console.log('Instructor Details -> ', instructorDetails);

        // validate
        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: 'Instructor Details Not Found',
            })
        }

        // check given category is valid or not
        // category here is category Id
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success: false,
                message: 'Category Details Not Found',
            })
        }

        // upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create new course entry in DB
        const newCourse  = await Course.create({
            courseName: courseName,
            courseDescription: courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price: price,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            tag: tag,
            status: status,
        })

        // add the new course to the intructor's course list
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new: true},
        );

        // update Category schema
        await Category.findByIdAndUpdate(
            {_id: category},
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new: true},
        )

        // return success response
        return res.status(200).json({
            success: true,
            data: newCourse,
            message: "Course Created Successfully",
          })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create course',
        })
    }
}

// get all course
exports.showAllCourses = async(req, res) => {
    try{
        const allCourses  =await Course.find({}, {
            courseName: true,
            courseDescription: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true,
        }).populate('instructor').exec();

        return res.status(200).json({
            success: true,
            message: 'Fetched all the courses',
            data: allCourses,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot fetch courses',
            error: error.message,
        })
    }
}

// get all details of a course
exports.getCourseDetails = async(req,res) => {
    try{
        // get course id
        const {courseId} = req.body;

        // find course details
        const courseDetails = await Course.find({_id: courseId})
        .populate(
            {
                path: 'instructor',
                populate:{
                    path: 'additionalDetails',
                },
            }
        )
        .populate('category')
        .populate('ratingAndReviews')
        .populate(
            {
                path: 'courseContent',
                populate: {
                    path: 'subSection',
                }
            }
        )
        .exec();

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
          content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
          })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: `Could not find the course with id: ${courseId}`,
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Course details fetched successfully',
            data: {
              courseDetails,
              totalDuration,
            }
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Edit Course Details
exports.editCourse = async (req, res) => {
    try {
      console.log('Entered try block')
      console.log('Request Body', req.body)
      const { courseId } = req.body
      console.log('Course Id', courseId)
      const updates = req.body
      const course = await Course.findById(courseId)

      console.log('Found course:', course)
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      return res.status(200).json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

  exports.getInstructorCourses = async (req, res) => {
    try {
      // get instructor id
      const instructorId = req.user.id;

      // fetch cpourses where the instructor is the instructor id
      const instructorCourses = await Course.find({ instructor: instructorId }).sort({ createdAt: -1 })

      return res.status(200).json({
        success: true,
        message: "Courses fetched successfully",
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

  exports.getFullCourseDetails = async (req, res) => {
    try {
      // get course id and user id
      const { courseId } = req.body
      const userId = req.user.id

      // fetch entire course details
      const courseDetails = await Course.findById({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()
      
      // fetch course progress
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      })

      // validate course
      if (!courseDetails) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        })
      }

      // calculate total duration
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
      
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

  exports.deleteCourse = async (req, res) => {
    try {
      // fetch course id
      const { courseId } = req.body

      // find course for that instructor
      const course = await Course.findById({ _id: courseId })

      // validate course
      if(!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        })
      }

      // unenroll students from the course
      const studentsEnrolled = course.studentsEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }

      // Delete sections and sub-sections
      // find course sections
    const courseSections = course.courseContent
    // iterate through sections
    for (const sectionId of courseSections) {
      // Find Section for that sectionId
      const section = await Section.findById(sectionId)
      if (section) {
        // find subsections for that section
        const subSections = section.subSection
        // iterate through subsections
        for (const subSectionId of subSections) {
          // Delete Subsection
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }