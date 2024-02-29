import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import IconButton from '../../../../common/IconButton'
import { IoAddCircleOutline } from "react-icons/io5"
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { toast } from 'react-hot-toast'

import { MdNavigateNext } from "react-icons/md"

import {
    createSection,
    updateSection,
  } from "../../../../../services/operations/courseDetailsAPI"



import {
    setCourse,
    setEditCourse,
    setStep,
  } from "../../../../../slices/courseSlice"
import NestedView from './NestedView'

const CourseBuilderForm = () => {

    const {course} = useSelector((state) => state.course)
    const {token} = useSelector((state) => state.auth)

    const dispatch = useDispatch();
    // useForm hook
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()

    // state variable to decide, if the Section Name button will be Create Section or Edit Section Name
    const [editSectionName, setEditSectionName] = useState(null)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data) => {
        setLoading(true);
        let result;

        // if we are editing an existing section
        if(editSectionName){
            result = await updateSection({
                    sectionName: data.sectionName,
                    sectionId: editSectionName,
                    courseId: course._id,
                }, token)
        }
        else{
            // if we are creating a new section
            result = await createSection({
                sectionName: data.sectionName,
                courseId: course._id,
            }, token)
        }

        // update values of course
        if(result){
            dispatch(setCourse(result))
            setEditSectionName(null)
            setValue("sectionName", "")
        }
        setLoading(false)
    }

    // function to set editSectionName to false
    // also reset the form value
    const cancelEdit = () => {
        setEditSectionName(null)
        setValue("sectionName", "")
    }

    // function to go back to step 1
    const goBack = () => {
        dispatch(setStep(1));
        // set editCourse to True as we have info of first step saved
        dispatch(setEditCourse(true))
    }

    // function to go to next step - 3
    const goToNext = () => {
        // Go to next step only when atleast when section is created
        console.log('Entered goToNext')
        if(course.courseContent.length === 0){
            toast.error("Add at least one section")
            return
        }

        console.log('Validated course length')
        // Go to next step whne atleast a video is added inside each section
        if(course.courseContent.some((section) => section.subSection.length === 0)){
            toast.error("Add at least one video in each section")
            return
        }

        console.log('Validated video length')

        dispatch(setStep(3));
    }

    // When we click on the edit button in the Nested view of the new section, the section name button will be changed
    const handleChangeEditSectionNameDueToNestedViewEditButton = (sectionId, sectionName) => {
        if(editSectionName === sectionId){
            cancelEdit();
            return
        }

        setEditSectionName(sectionId);
        setValue("sectionName", sectionName);
    }

    

  return (
    <div className='space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6'>
        {/* Heading */}
        <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='flex flex-col space-y-2'>
                {/* label */}
                <label className="text-sm text-richblack-5" htmlFor="sectionName">
                    Section Name <sup className="text-pink-200">*</sup>
                </label>
                <input
                id="sectionName"
                placeholder="Enter Section Name"
                {...register("sectionName", { required: true })}
                className="form-style w-full"
                />
                {errors.sectionName && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Section name is required
                    </span>
                )}
            </div>

            <div className='flex items-end gap-x-4'>
                {/* Create Section/Edit Section Name Button */}
                <IconButton
                type="submit"
                disabled={loading}
                text={editSectionName ? "Edit Section Name" : "Create Section"}
                outline={true}>
                    <IoAddCircleOutline size={20} className="text-yellow-50" />
                </IconButton>

                {/* Cancel Edit Button =- rendered only when editSectionName is true */}
                {
                    editSectionName && (
                        <button
                        type="button"
                        onClick={cancelEdit}
                        className="text-sm text-richblack-300 underline">
                            Cancel Edit
                        </button>
                    )
                }
            </div>
        </form>

        {/* Display Course Content in a Nested View */}
        {
            course?.courseContent?.length > 0 && (
                <NestedView handleChangeEditSectionNameDueToNestedViewEditButton={handleChangeEditSectionNameDueToNestedViewEditButton}>

                </NestedView>
            )
        }

        {/* Back & Next Button */}
        <div className='flex justify-end gap-x-3'>
            {/* Back Button */}
            <button
            type="button"
            onClick={goBack}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900">
                Back
            </button>
            {/* Next Button */}
            <IconButton
            text="Next"
            onclick={goToNext}
            disabled={loading}>
                <MdNavigateNext />
            </IconButton>
        </div>
    </div>
  )
}

export default CourseBuilderForm