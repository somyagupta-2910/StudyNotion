const Subsection = require('../models/SubSection');
const Section = require('../models/Section');
const { uploadImageToCloudinary } = require('../utils/imageUploader');


// create subsection
exports.createSubSection = async(req,res) => {
    try{
        // fetch data
        const {sectionId, title, description} = req.body;

        // extract video file
        const video = req.files.video;

        console.log('Pre-validation')

        // validate
        if(!sectionId || !title || !description){
            return res.status(404).json({
                success: false,
                message: 'All fields are required'
            })
        }

        console.log('Validated')
        // upload video to cloudinary
        const videoUploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)

        console.log('Video Uploaded')

        // create a subsection and insert to DB
        const SubSectionDetails = await Subsection.create({
            title: title,
            //timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: videoUploadDetails.secure_url,
        })

        console.log('Subsection Created')

        // update section with the subsection
        const updatedSection = await Section.findByIdAndUpdate(
            {_id: sectionId},
            {
                $push: {
                    subSection: SubSectionDetails._id,
                }
            },
            {new: true},
        ).populate("subSection")

        console.log('Section Fetched')

        // return response
        return res.status(200).json({ 
            success: true, 
            message: 'Subsection created successfully',
            data: updatedSection 
        })
    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: "Unable to Create Subsection, please try again",
			error: error.message,
		});
    }
}

// update subsection
exports.updateSubSection = async(req,res) => {
    try{
        // fetch data
        const { sectionId, subSectionId, title, description} = req.body;

        console.log(subSectionId);

        // retrieve the subsection
        const subSection = await Subsection.findById(subSectionId)

        console.log('Data Retrieved')

        // validate
        if(!subSection){
            return res.status(404).json({
                success: false,
                message: 'Subsection not found'
            })
        }

        // update those fields that are passed
        if(title !== undefined){
            subSection.title = title;
        }
        if(description !== undefined){
            subSection.description = description;
        }

        // update video
        if (req.files && req.files.videoFile !== undefined) {
            // fetch video
            const video = req.files.videoFile;
            // upload to cloiudinary
            const uploadDetails = await uploadImageToCloudinary(
              video,
              process.env.FOLDER_NAME
            )
            // fetch video url and time duration and save it in DB
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
          }
      
          await subSection.save();

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate(
        "subSection"
      )

          return res.status(200).json({
            success: true,
            message: 'Subsection updated successfully',
            data: updatedSection,
          })
    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: "Unable to update Subsection, please try again",
			error: error.message,
		});
    }
}

// delete subsection
exports.deleteSubSection = async(req,res) => {
    try{
        // fetch data
        const {subSectionId, sectionId} = req.body;

        console.log('Subsection ID: ', subSectionId);
        console.log(sectionId);

        // delete record in Subsection db
        const deletedSubsection = await Subsection.findByIdAndDelete({_id: subSectionId});

        if(!deletedSubsection){
            return res.status(404).json({ 
                success: false, 
                message: "SubSection not found" 
            })
        }
        
        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
        )
    
        return res.status(200).json({
            success: true,
            message: 'Subsection Deleted Successfully',
            data: updatedSection,
        });
    }
    catch(error){
        return res.status(500).json({
			success: false,
			message: "Unable to delete Subsection, please try again",
			error: error.message,
		});
    }
}