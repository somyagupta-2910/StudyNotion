const cloudinary = require('cloudinary').v2;

// utility function to upload files to cloudinary
exports.uploadImageToCloudinary = async(file, folder, height, quality) => {
    console.log('Entered uploadImageToCloudinary function')

    const options = {folder};
    console.log('Recived Folder')
    if(quality){
        options.height = height;
    }
    if(quality){
        options.quality = quality;
    }

    console.log('Options', options)
    options.resource_type = 'auto';

    console.log('Entering Upload State');
    // upload file to cloudinary
    try {
        // upload file to cloudinary
        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        console.log('Upload Successful', result);
        return result;
    } catch (error) {
        // Log the error if upload fails
        console.error('Upload Failed', error);
        throw error; // Re-throw the error if you want calling function to handle it
    }
}