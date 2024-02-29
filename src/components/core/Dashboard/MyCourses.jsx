import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI'
import IconButton from '../../common/IconButton'
import { VscAdd } from "react-icons/vsc"
import CourseTable from './InstructorCourses/CourseTable'


const MyCourses = () => {
    const {token} = useSelector((state) => state.auth)
    const navigate = useNavigate()

    // state variable for courses
    const [courses, setCourses] = useState([])

    // get all the courses during the first render
    useEffect(() => {
        const fetchCourses = async () => {
            // API call to get the instructor courses
            const result = await fetchInstructorCourses(token);

            // assign the state variable with the fetched courses
            if(result){
                setCourses(result)
            }
        }
        fetchCourses()
    }, [])
  return (
    <div>
        {/* Div for Heading and Add Courses Button */}
        <div className="mb-14 flex items-center justify-between">
            <h1 className="text-3xl font-medium text-richblack-5">
                My Courses
            </h1>
            {/* Navigate to add-course route when it is clicked */}
            <IconButton
            text="Add Course"
            onclick={() => navigate("/dashboard/add-course")}
            >
            <VscAdd />
            </IconButton>
      </div>
      {/* Compoennt to display courses */}
      {courses && <CourseTable courses={courses} setCourses={setCourses}></CourseTable>}
    </div>
  )
}

export default MyCourses