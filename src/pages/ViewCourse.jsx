import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar'
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal'
import {
    setCompletedLectures,
    setCourseSectionData,
    setEntireCourseData,
    setTotalNoOfLectures,
  } from "../slices/viewCourseSlice"

const ViewCourse = () => {
    // get token
    const {token} = useSelector((state) => state.auth)
    // get course id from the url
    const {courseId} = useParams()

    const dispatch = useDispatch();

    // modal for addig review for the course
    const [reviewModal, setReviewModal] = useState(false)

    useEffect(() => {
        const setCourseSpecificDetails = async() => {
            const courseData = await getFullDetailsOfCourse(courseId, token)

            // set the slices
            dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
            dispatch(setEntireCourseData(courseData.courseDetails))
            dispatch(setCompletedLectures(courseData.completedVideos))

            // get total number of lectures
            let lectures = 0
            courseData?.courseDetails?.courseContent?.forEach((sec) => {
                lectures += sec.subSection.length
            })
            // set the total number of lectures
            dispatch(setTotalNoOfLectures(lectures))
        }
        setCourseSpecificDetails()
    }, [])
  return (
    <>
        
        <div>
            {/* Course Sidebar with Review Modal */}
            <VideoDetailsSidebar setReviewModal={setReviewModal}></VideoDetailsSidebar>

            <div>
                <Outlet></Outlet>
            </div>
        </div>
        {
            reviewModal && <CourseReviewModal setReviewModal={setReviewModal}></CourseReviewModal>
        }
    </>
  )
}

export default ViewCourse