import React from 'react'
import ConfirmationModal from '../../../../common/ConfirmationModal'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'

import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"

import SubSectionModal from './SubSectionModal'

import {
    deleteSection,
    deleteSubSection,
  } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"

const NestedView = ({handleChangeEditSectionNameDueToNestedViewEditButton}) => {
    const {course} = useSelector((state) => state.course)
    const {token} = useSelector((state) => state.auth)
    const dispatch = useDispatch();

    // state variables to add/view/edit sub-section
    const [addSubSection, setAddSubSection] = useState(null)
    const [viewSubSection, setViewSubSection] = useState(null)
    const [editSubSection, setEditSubSection] = useState(null)

    // state variable for confirmation modal to be shown or not
    const [confirmationModal, setConfirmationModal] = useState(null)

    // function to delete section
    const handleDeleteSection = async(sectionId) => {
        // call delete section api
        const result = await deleteSection({sectionId, courseId: course._id}, token)

        // update setCourse slice
        if(result){
            dispatch(setCourse(result))
        }

        setConfirmationModal(null)
    }

    // function to delete sub-section
    const handleDeleteSubSection = async (subSectionId, sectionId) => {
        // call delete sub-section api
        const result = await deleteSubSection({ subSectionId, sectionId, token })

        if (result) {
          // update the structure of course
          const updatedCourseContent = course.courseContent.map((section) =>
            section._id === sectionId ? result : section
          )
          const updatedCourse = { ...course, courseContent: updatedCourseContent }

          // update setCourse slice
          dispatch(setCourse(updatedCourse))
        }
        setConfirmationModal(null)
      }

  return (
    <>
        <div className='rounded-lg bg-richblack-700 p-6 px-8'>
            {
                course?.courseContent?.map((section) => (
                    <details key={section._id} open>
                        {/* Render Section */}

                        {/* Div for Section Details */}
                        <summary className='flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2'>                    
                            {/* Div for dropdown icon and section name */}
                            <div className='flex items-center gap-x-3'>
                                <RxDropdownMenu className="text-2xl text-richblack-50"></RxDropdownMenu>
                                <p className="font-semibold text-richblack-50">
                                    {section.sectionName}
                                </p>
                            </div>

                            {/* Div for Edit and Delete Icon */}
                            <div className="flex items-center gap-x-3">
                                {/* Edit Icon - call the function we created for edit button in CourseBuilder */}
                                <button
                                onClick={() => handleChangeEditSectionNameDueToNestedViewEditButton(section._id, section.sectionName)}>
                                    <MdEdit className="text-xl text-richblack-300" />
                                </button>

                                {/* Delete Icon - When it is clicked. A Confirmation Modal will be shown */}
                                <button
                                onClick={() => setConfirmationModal({
                                    text1: "Delete this Section?",
                                    text2: "All the lectures in this section will be deleted",
                                    btn1Text: "Delete",
                                    btn2Text: "Cancel",
                                    btn1Handler: () => handleDeleteSection(section._id),
                                    btn2Handler: () => setConfirmationModal(null),
                                })}>
                                    <RiDeleteBin6Line className="text-xl text-richblack-300" />
                                </button>

                                <span className="font-medium text-richblack-300">|</span>
                                <AiFillCaretDown className={`text-xl text-richblack-300`} />
                            </div>
                        </summary>

                        {/* Render Sub-Section */}
                        <div className='px-6 pb-4'>
                            {
                                section?.subSection?.map((data) => (
                                    //* Div for Subsection
                                    // When the subsection is clicked, a modal is opened which is fied up using the setViewSubSection function */}
                                    <div 
                                    key={data?._id}
                                    onClick={() => setViewSubSection(data)}
                                    className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2">
                                        {/* Subsection Title and Icon */}
                                        <div className="flex items-center gap-x-3 py-2 ">
                                            <RxDropdownMenu className="text-2xl text-richblack-50" />
                                            <p className="font-semibold text-richblack-50">
                                                {data?.title}
                                            </p>
                                        </div>

                                        {/* Edit and Delete Button for Subsection */}
                                        {/* e.stopPropagation is used to stop the event bubbling. That is, the event will not be triggered on the parent element. The parent element has view sub section modal. That will be disabled by clicking on the edit and delete button */}
                                        <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-x-3">
                                            {/* Edit Icon - Subsection */}
                                            <button
                                            onClick={() => setEditSubSection({...data, sectionId: section._id})}>
                                                <MdEdit className="text-xl text-richblack-300" />
                                            </button>

                                            {/* Delete Icon - Subsection */}
                                            {/* When it is clicked. A Confirmation Modal will be shown */}
                                            <button
                                            onClick={() =>
                                                setConfirmationModal({
                                                text1: "Delete this Sub-Section?",
                                                text2: "This lecture will be deleted",
                                                btn1Text: "Delete",
                                                btn2Text: "Cancel",
                                                btn1Handler: () =>
                                                    handleDeleteSubSection(data._id, section._id),
                                                btn2Handler: () => setConfirmationModal(null),
                                                })
                                            }
                                            >
                                                <RiDeleteBin6Line className="text-xl text-richblack-300" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                            {/* Add Lecture Button */}
                            <button
                            onClick={() => setAddSubSection(section._id)}
                            className="mt-3 flex items-center gap-x-1 text-yellow-50"
                            >
                                <FaPlus className="text-lg" />
                                <p>Add Lecture</p>
                            </button>
                        </div>
                    </details>
                ))
            }
        </div>
        {/* Modal Conditions for Add, View and Edit */}
        {
            addSubSection        
            ? (<SubSectionModal
                modalData={addSubSection}
                setModalData={setAddSubSection}
                add={true}
            />) 
            : viewSubSection 
            ? (<SubSectionModal 
                modalData={viewSubSection}
                setModalData={setViewSubSection}
                view={true}
            />) 
            : editSubSection 
            ? (<SubSectionModal 
                modalData={editSubSection}
                setModalData={setEditSubSection}
                edit={true}
            />) : (<></>)
        }

        {/* Confirmation Modal */}
        {confirmationModal ? (
            <ConfirmationModal modalData={confirmationModal} />
        ) : (
            <></>
        )}
    </>
  )
}

export default NestedView