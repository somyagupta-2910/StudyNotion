import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
//import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useSelector } from "react-redux"
import Course_Card from '../components/core/Catalog/Course_Card';
import Error from "./Error"

const Catalog = () => {
    const { loading } = useSelector((state) => state.profile)
    // Get the catalogName from the URL
    const { catalogName } = useParams()

    // state variable for the tab pane
    const [active, setActive] = useState(1)
    // state variable for catalog page data
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    // render whenever catalogName changes in the url
    // fetch all categories
    useEffect(() => {
        const getCategories = async() => {
            // api call for fetching categories
            const res = await apiConnector("GET", categories.CATEGORIES_API);

            // get the category id
            const category_id = 
            res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;

            // set the category id state variable
            setCategoryId(category_id);
        }
        getCategories();
    }, [catalogName])

    // render when categoryId changes
    useEffect(() => {
        const getCategoryDetails = async() => {
            try{
                // get all the details of the category
                const res = await getCatalogPageData(categoryId);

                // set the state variable for category details
                setCatalogPageData(res);
            }
            catch(error){
                console.log(error);
            }
        }
        if(categoryId) {
            getCategoryDetails();
        }
    }, [categoryId])

    if (loading || !catalogPageData) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }
      if (!loading && !catalogPageData.success) {
        return <Error />
      }

  return (
    <div>
        {/* Hero Section Div */}
        <div className=" box-content bg-richblack-800 px-4">
            {/* Container for Displaying pagination, Category Name */}
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                {/* Pagination */}
                <p className="text-sm text-richblack-300">
                    {`Home / Catalog / `}
                    <span className="text-yellow-25">
                        {catalogPageData?.data?.selectedCategory?.name}
                    </span>
                </p>
                {/* Category Name */}
                <p className="text-3xl text-richblack-5">
                    {catalogPageData?.data?.selectedCategory?.name}
                </p>

                {/* Category Description */}
                <p className="max-w-[870px] text-richblack-200">
                {catalogPageData?.data?.selectedCategory?.description}
                </p>
            </div>
        </div>

        {/* Section 1 - Div for Most Popular */}
        <div className='mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
            {/* Section Heading */}
            <div className="section_heading">Courses to get you started</div>

            {/* Tab Pane for 'Most Popular' and 'New */}
            <div className='my-4 flex border-b border-b-richblack-600 text-sm'>
                {/* Most Popular Tab Button */}
                {/* onClick={() => setActive(1)} will activate this tab */}
                <p 
                className={`px-4 py-2 
                ${active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(1)}
                >
                    Most Popular
                </p>
                {/* New Tab Button */}
                {/* onClick={() => setActive(2)} will activate this tab */}
                <p
                    className={`px-4 py-2 ${
                    active === 2
                        ? "border-b border-b-yellow-25 text-yellow-25"
                        : "text-richblack-50"
                    } cursor-pointer`}
                    onClick={() => setActive(2)}
                >
                    New
                </p>
            </div>

            {/* Display all Courses for the selected Category */}
            <div>
              <CourseSlider
                Courses={catalogPageData?.data?.selectedCategory?.courses}
              />
            </div>
        </div>

        {/* Section 2 - Div for Courses from other categories */}
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">
              Top courses in {catalogPageData?.data?.differentCategory?.name}
            </div>
            <div className="py-8">
              <CourseSlider
                Courses={catalogPageData?.data?.differentCategory?.courses}
              />
            </div>
        </div>

        {/* Section 3 - Top selling courses */}
        <div className='mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
            <div className="section_heading">Frequently Bought</div>
            <div className='py-8'>
                {/* Top selling courses - Grid Container */}
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    {
                        // send the top 4 course
                        catalogPageData?.data?.mostSellingCourses?.slice(0,4).map((course, index) => (
                            // Course Card for each individual top selling course
                            <Course_Card key={index} course={course} Height={"h-[400px]"}></Course_Card>
                        ))
                    }
                    
                </div>
            </div>
        </div>
        
        {/* Footer */}
        <Footer />
    </div>
  )
}

export default Catalog