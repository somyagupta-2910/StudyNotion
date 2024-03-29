import React from 'react'
import { useDispatch } from 'react-redux'
import { useState } from 'react';
import { useSelector } from 'react-redux'
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"

import { formatDate } from '../../../../services/formatDate';

import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../common/ConfirmationModal"
import { useNavigate } from 'react-router-dom'

const CourseTable = ({courses, setCourses}) => {
    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false)
    const [confirmationModal, setConfirmationModal] = useState(null)
    const TRUNCATE_LENGTH = 30
    const navigate = useNavigate()

    const handleCourseDelete = async (courseId) => {
        setLoading(true)

        // delete course api call
        await deleteCourse({ courseId: courseId }, token)

        // get updated courses list
        const result = await fetchInstructorCourses(token)
        if (result) {
            setCourses(result)
        }

        setConfirmationModal(null)
        setLoading(false)
    }

  return (
    <>
        <Table className='rounded-xl border border-richblack-800'>
            {/* Header */}
            <Thead>
                <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
                    <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
                        Courses
                    </Th>
                    <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                        Duration
                    </Th>
                    <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                        Price
                    </Th>
                    <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                        Actions
                    </Th>
                </Tr>
            </Thead>

            {/* Body */}
            <Tbody>
                {
                    courses?.length === 0 ? (
                        <Tr>
                            <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                                No courses found
                                
                            </Td>
                        </Tr>
                    ) : (
                        courses?.map((course) => (
                            <Tr key={course._id} className='flex gap-x-10 border-b border-richblack-800 px-6 py-8'>
                                {/* First Column - Has Thumbnail  */}
                                <Td className='flex flex-1 gap-x-4'>
                                    <img
                                        src={course?.thumbnail}
                                        alt={course?.courseName}
                                        className="h-[148px] w-[220px] rounded-lg object-cover"
                                    />
                                    {/* Course Title and Description */}
                                    <div className='flex flex-col justify-between'>
                                        {/* Course Title */}
                                        <p className='text-lg font-semibold text-richblack-5'>{course?.courseName}</p>

                                        {/* Course Description - We will not show the entire description. We will truncate some part of it */}
                                        <p className="text-xs text-richblack-300">
                                        {
                                            course.courseDescription.split(" ").length >
                                        TRUNCATE_LENGTH
                                            ? course.courseDescription
                                                .split(" ")
                                                .slice(0, TRUNCATE_LENGTH)
                                                .join(" ") + "..."
                                            : course.courseDescription
                                        }
                                        </p>

                                        {/* Course Duration */}
                                        <p className="text-[12px] text-white">
                                            Created: {formatDate(course.createdAt)}
                                        </p>
                                        {/* Conditional Rendering - based on DRAFT or Published Status */}
                                        {
                                            course?.status === COURSE_STATUS.DRAFT ? (
                                                <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                                                    <HiClock size={14} />
                                                    Drafted
                                                </p>
                                            ) : (
                                                <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                                                    <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                                                    <FaCheck size={8} />
                                                    </div>
                                                    Published
                                                </p>
                                            )
                                        }
                                    </div>
                                </Td>

                                {/* Second Column - Course Duration */}
                                <Td className="text-sm font-medium text-richblack-300">
                                    {course?.duration}
                                </Td>

                                {/* Course Price */}
                                <Td className='text-sm font-medium text-richblack-300'>
                                    ₹{course?.price}
                                </Td>

                                {/* Third Coulmn - Edit and Delete Buttons */}
                                <Td className="text-sm font-medium text-richblack-100">
                                    <button
                                    disabled={loading}
                                    title="Edit"
                                    onClick={() => {navigate(`/dashboard/edit-course/${course._id}`)}}
                                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"     
                                    >
                                        <FiEdit2 size={20} />
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                    type='button'
                                    disabled={loading}
                                    title='Delete'
                                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                                    onClick={() => setConfirmationModal({
                                        text1: "Do you want to delete this course?",
                                        text2: "All the data related to this course will be deleted",
                                        btn1Text: !loading ? "Delete" : "Loading...",
                                        btn2Text: "Cancel",
                                        btn1Handler: !loading ? () => handleCourseDelete(course?._id) : () => {},
                                        btn2Handler: !loading
                                        ? () => setConfirmationModal(null)
                                        : () => {},
                                    })}>
                                        <RiDeleteBin6Line size={20} />
                                    </button>
                                </Td>
                            </Tr>
                        ))
                    )
                }
            </Tbody>
        </Table>
        {
            confirmationModal && <ConfirmationModal modalData={confirmationModal} />
        }
    </>
  )
}

export default CourseTable
