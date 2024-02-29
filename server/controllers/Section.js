const Section = require('../models/Section');
const Course = require('../models/Course');
const SubSection = require("../models/SubSection");

// create a secrtion
exports.createSection = async(req, res) => {
    try{
        // fetch data
        const {sectionName, courseId} = req.body;

        //validate
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: 'Missing properties',
            })
        }

        // create section in DB
        const newSection = await Section.create({ sectionName });

        // update section in Course
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            {new: true},
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec(); // here we populate both section and subsection

        console.log('Created Section')

        // return response
        return res.status(200).json({
            success: true,
            message: 'Section Created Successfully',
            data: updatedCourseDetails,
        })
    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: "Unable to create section, please try again",
			error: error.message,
		});
    }
}

// update a section
exports.updateSection = async(req, res) => {
    try{
        // fetch data
        const {sectionName, sectionId, courseId} = req.body;

        // validate data
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: 'Missing properties',
            })
        }

        // update data in Section DB
        const updateSectionDetails = await Section.findByIdAndUpdate(
            sectionId,
            {sectionName},
            {new: true},
        )

        // fetcgh course details
        const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();

        console.log('Updated Section')

		return res.status(200).json({
			success: true,
			message: 'Section Updated successfully',
            data: course,
		});
    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: "Unable to update section, please try again",
			error: error.message,
		});
    }
}

// delete a section
exports.deleteSection = async(req,res) => {
    try{
        // fetch section id and course if
        const { sectionId, courseId }  = req.body;

        // remove section from the course
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})

        // find the section
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);

        // validate section
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section belonging to that section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

        // delete section
		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

        // return response
		return res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: "Unable to delete section, please try again",
			error: error.message,
		});
    }
}