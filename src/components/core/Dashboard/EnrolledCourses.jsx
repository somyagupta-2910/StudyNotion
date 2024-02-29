import React, { useEffect } from 'react'
import ProgressBar from "@ramonak/react-progress-bar"
import { useState } from 'react'

import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

const EnrolledCourses = () => {
    const {token} = useSelector((state) => state.auth)
    const navigate = useNavigate();

    // state variable for enrolledCourses
    const [enrolledCourses, setEnrolledCourses] = useState(null)

    // Function for API call
    const getEnrolledCourses = async() => {
        try{
            // API Call
            const response = await getUserEnrolledCourses(token);

            console.log(response);

            // Set state
            setEnrolledCourses(response);
        }
        catch(err){
            console.log(err)
        }
    }

    // Render courses on first render
    useEffect(() => {
        getEnrolledCourses();
    }, [])

  return (
    <div>
        {/* Heading */}
        <h1 className='text-3xl text-richblack-50'>Enrolled Courses</h1>

        {
            // If there is no enrolled courses, then display loading
            !enrolledCourses 
            ? (<div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>) 
            // Also if the user has zero enrolled courses, display the following text or else render the courses
            : !enrolledCourses.length 
                ? (<div className='grid h-[10vh] w-full place-content-center text-richblack-5'>No Courses Enrolled</div>) 
                : (
                    // Main Courses Enrolled Table Div
                    <div className='my-8 text-richblack-5'>

                        {/* Enrolled Courses Header Div */}
                        <div className='flex rounded-t-lg bg-richblack-500'>
                            <p className="w-[45%] px-5 py-3">Course Name</p>
                            <p className="w-1/4 px-2 py-3">Duration</p>
                            <p className="flex-1 px-2 py-3">Progress</p>
                        </div>
                        {/* Enrolled Courses - Map */}
                        {
                            enrolledCourses.map((course, index) => {
                                <div 
                                key={index} className='flex items-center border border-richblack-700'>
                                    {/* Course Name and Image Div */}
                                    {/* Clicking on this div will take us to the course */}
                                    <div 
                                    className='flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3'
                                    onClick={() => navigate(`/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}>
                                        {/* Course Image */}
                                        <img src={course.thumbnail}
                                        alt="course_img"
                                        className="h-14 w-14 rounded-lg object-cover"></img>

                                        {/* Course name  and Description Div*/}
                                        <div className='flex flex-col gap-2 max-w-xs'>
                                            {/* Course Name */}
                                            <p>{course?.name}</p>
                                            {/* Course Description */}
                                            <p>{course?.description}</p>
                                        </div>
                                    </div>

                                    {/* Course Duration Div */}
                                    <div className='w-1/4 px-2 py-3'>
                                        {course?.totalDuration}
                                    </div>

                                    {/* Course Progress Div */}
                                    <div className='flex flex-col'>
                                        {/* Progress Text */}
                                        <p>Progress: {course?.progressPercentage || 0}%</p>

                                        {/* Progress Bar */}
                                        <ProgressBar completed={course?.progressPercentage || 0} height="8px"
                                        isLabelVisible={false} />
                                    </div>
                                </div>
                            })
                        }
                    </div>
                )
        }
    </div>
  )
}

export default EnrolledCourses