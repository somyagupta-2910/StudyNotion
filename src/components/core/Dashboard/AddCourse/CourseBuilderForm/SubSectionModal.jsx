import React from 'react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { toast } from 'react-hot-toast'
import { useEffect } from 'react'
import { RxCross2 } from "react-icons/rx"
import IconButton from '../../../../common/IconButton'

import {
    createSubSection,
    updateSubSection,
  } from "../../../../../services/operations/courseDetailsAPI"
  import { setCourse } from "../../../../../slices/courseSlice"
import Upload from '../Upload'

const SubSectionModal = ({modalData, setModalData, add=false, view=false, edit=false}) => {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const { token } = useSelector((state) => state.auth)
    const { course } = useSelector((state) => state.course)

    // when we are in view or edit mode, the data already exists. So, render it during the first render
    useEffect(() => {
        if(view || edit){
            setValue("lectureTitle", modalData.title)
            setValue("lectureDesc", modalData.description)
            setValue("lectureVideo", modalData.videoUrl)
        }
    }, [])

    // check if form is updated or not
    const isFormUpdated = () => {
        const currentValues = getValues();

        if(currentValues.lectureTitle !== modalData.title || currentValues.lectureDesc !== modalData.description || currentValues.lectureVideo !== modalData.videoUrl){
            return true
        }
        return false;
    }

    // edit subsection
    const handleEditSubSection = async () => {
        // get the form values
        const currentValues = getValues();
        // create form data
        const formData = new FormData();

        // append the section id and subsection id that we passed in the modalData
        formData.append('sectionId', modalData.sectionId);
        formData.append("subSectionId", modalData._id)

        // if form is updated, append to the formData
        if (currentValues.lectureTitle !== modalData.title) {
            formData.append("title", currentValues.lectureTitle)
        }
        if (currentValues.lectureDesc !== modalData.description) {
        formData.append("description", currentValues.lectureDesc)
        }
        if (currentValues.lectureVideo !== modalData.videoUrl) {
        formData.append("video", currentValues.lectureVideo)
        }

        // update the subsection
        setLoading(true)

        //api call
        const result = await updateSubSection(formData, token)


        if (result) {
            // update the structure of course
            const updatedCourseContent = course.courseContent.map((section) =>
                section._id === modalData.sectionId ? result : section
            )
            const updatedCourse = { ...course, courseContent: updatedCourseContent }
            dispatch(setCourse(updatedCourse))
        }

        setModalData(null)
        setLoading(false)
    }

    const onSubmit = async (data) => {
        // during view, we will not do anything. Hence, just return
        if(view){
            return;
        }

        // edit subsection - case
        if(edit){
            // if form is not updated, we will show error
            if(!isFormUpdated()){
                toast.error('No changes made in the form');
            }
            else{
                // edi the subsection
                handleEditSubSection();
            }
            return;
        }

        // add new subsection - case
        const formData = new FormData();
        // append the section id that we passed in the modalData
        formData.append('sectionId', modalData);
        formData.append("title", data.lectureTitle)
        formData.append("description", data.lectureDesc)
        formData.append("video", data.lectureVideo)

        setLoading(true);

        // api call to add new subsection
        const result = await createSubSection(formData, token);

        if(result){
            // update the structure of course
            const updatedCourseContent = course.courseContent.map((section) =>
            section._id === modalData ? result : section
            )
            const updatedCourse = { ...course, courseContent: updatedCourseContent }
            dispatch(setCourse(updatedCourse))
        }

        setModalData(null);
        setLoading(false);
    }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
        {/* Modal Container */}
        <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5"> 
                {/* Header */}
                <p className="text-xl font-semibold text-richblack-5">
                    {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
                </p>
                {/* Modal Close Button */}
                <button onClick={() => (!loading ? setModalData(null) : {})}>
                    <RxCross2 className="text-2xl text-richblack-5" />
                </button>
            </div>

            {/* Modal Content - Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">
                {/* Video upload Option */}
                <Upload
                name='lectureVideo'
                label='Lecture Video'
                register={register}
                setValue={setValue}
                errors={errors}
                video={true}
                viewData={view ? modalData.videoUrl : null}
                editData={edit ? modalData.videoUrl : null}></Upload>

                {/* Update Title */}
                <div className="flex flex-col space-y-2">
                    {/* Label */}
                    <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
                    Lecture Title {!view && <sup className="text-pink-200">*</sup>}
                    </label>
                    <input
                        type='text'
                        id='lectureTitle'
                        disabled={view || loading}
                        placeholder='Enter Lecture Title'
                        {...register("lectureTitle", { required: true })}
                        className="form-style w-full"
                    />
                    {errors.lectureTitle && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200">
                            Lecture title is required
                        </span>
                    )}
                </div>

                {/* Update Description */}
                <div className="flex flex-col space-y-2">
                    {/* Label */}
                    <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
                    Lecture Description{" "}
                    {!view && <sup className="text-pink-200">*</sup>}
                    </label>
                    {/* textarea input */}
                    <textarea
                    id='lectureDesc'
                    placeholder='Enter Lecture Decription'
                    {...register("lectureDesc", { required: true })}
                    className="form-style resize-x-none min-h-[130px] w-full"></textarea>
                    {errors.lectureDesc && (
                        <span className="ml-2 text-xs tracking-wide text-pink-200">
                            Lecture description is required
                        </span>
                    )}
                </div>

                {/* Buttons */}
                {
                    !view && (
                        <div>
                            <IconButton
                            disabled={loading}
                            text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}></IconButton>
                        </div>
                    )
                }
            </form>
        </div>
    </div>
  )
}

export default SubSectionModal