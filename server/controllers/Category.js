const Category = require('../models/Category');
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }


// Handler for creating Category
exports.createCategory = async(req, res) => {
    try{
        // fetch data
        const {name, description} = req.body;

        // validation
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            })
        }

        // create entry in DB
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        })
        console.log(categoryDetails);

        return res.status(200).json({
            success: true,
            message: 'Category created successfully',
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

// Fetch all Categories
exports.showAllCategories = async(req, res) => {
    try{
        const allCategories = await Category.find({});

        console.log('Backend:', allCategories);

        console.log('fetched all categories')

        return res.status(200).json({
            success: true,
            message: 'All Categories returned successfully',
            data: allCategories,
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

// Category Page Details - This will fetch the courses under a category. Also, we will fetch top-selling courses
exports.categoryPageDetails = async(req,res) => {
    try{
        // get category id
        const {categoryId} = req.body;

        console.log('categoryPageDetails categoryID', categoryId)

        // get all the courses corressponding to the category
        const selectedCategory = await Category.findById(categoryId).populate('courses').exec();

        // validate
        if(!selectedCategory){
            return res.status(404).json({
                success: false,
                message: 'Data Not Found',
            })
        }

        console.log('Validated Category', selectedCategory)

        // get courses for all categories except the mentioned category
        // Get all categories except the selected
        const categoriesExceptSelected = await Category.find({
            _id: {$ne: categoryId},
        })

        console.log('Different Categories', categoriesExceptSelected)

        // Get courses of a random category
        let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
            ._id
        )
        .populate({
            path: "courses",
            match: { status: "Published" },
        })
        .exec()

        console.log("Different COURSE", differentCategory)

        //Get top-selling courses across all categories
        const allCategories = await Category.find()
        .populate({
            path: "courses",
            match: { status: "Published" },
            populate: {
                path: "instructor",
            },
        })
        .exec()

        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)

        return res.status(200).json({
            success: true,
            data: {
              selectedCategory,
              differentCategory,
              mostSellingCourses,
            }
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}