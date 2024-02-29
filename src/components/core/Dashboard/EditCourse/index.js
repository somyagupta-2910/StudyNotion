import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import RenderSteps from '../AddCourse/RenderSteps'
import {
    fetchCourseDetails,
    getFullDetailsOfCourse,
  } from "../../../../services/operations/courseDetailsAPI"
  import { setCourse, setEditCourse } from "../../../../slices/courseSlice"

export default function EditCourse() {
    const dispatch = useDispatch()
    const {course} = useSelector((state) => state.course)
    const {token} = useSelector((state) => state.auth)

    // fetch course id from url that we are sending when we click on edit icon of the My Courses page
    const {courseId} = useParams()

    const [loading, setLoading] = useState(false)

    // during first render get the course details
    useEffect(() => {
        const populateCourseDetails = async () => {
            setLoading(true)

            // fetch course details API call
            const result = await getFullDetailsOfCourse(courseId, token)

            if(result){
                // set the edit Course variable as true
                dispatch(setEditCourse(true))
                // setCourse with the fetched course
                dispatch(setCourse(result))
            }
            setLoading(false)
        }
        populateCourseDetails();
    }, [])

    if(loading){
        return (
            <div className="grid flex-1 place-items-center">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div>
            <h1 className='mb-14 text-3xl font-medium text-richblack-5'>Edit Course</h1>
            <div className='mx-auto max-w-[600px]'>
                {
                    course ? (<RenderSteps></RenderSteps>) : (<p className='mt-14 text-center text-3xl font-semibold text-richblack-100'>Course not found</p>)
                }
            </div>
        </div>
    )
}