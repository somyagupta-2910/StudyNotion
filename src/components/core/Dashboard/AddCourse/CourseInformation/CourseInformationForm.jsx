import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { HiOutlineCurrencyRupee } from "react-icons/hi"

import RequirementField from './RequirementField'
import ChipInput from './ChipInput'

import {
    addCourseDetails,
    editCourseDetails,
    fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import IconButton from '../../../../common/IconButton'
import toast from 'react-hot-toast'
import { COURSE_STATUS } from "../../../../../utils/constants"
import Upload from '../Upload'

const CourseInformationForm = () => {
    const { token } = useSelector((state) => state.auth)
    // React Form
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()


    const dispatch = useDispatch();

    // get course and editCourse from from slice
    const { course, editCourse } = useSelector((state) => state.course)
    // state variable for loader
    const [loading, setLoading] = useState(false)

    // state variable for course categories
    const [couseCategories, setCourseCategories] = useState([])

    // get course categories on render
    useEffect(() => {
        const getCategories = async() => {
            setLoading(true)
            
            // fetch course categories from the 
            const categories = await fetchCourseCategories();
            console.log("categories received", categories)
            // setCourseCategories in state
            if(categories.length > 0) {
                setCourseCategories(categories)
            }

            setLoading(false)
        }

        // if we are editing an existing course, then populate the form fields with the course values
        if (editCourse) {
            // initially populate data with the inital course values
            setValue("courseTitle", course.courseName)
            setValue("courseShortDesc", course.courseDescription)
            setValue("coursePrice", course.price)
            setValue("courseTags", course.tag)
            setValue("courseBenefits", course.whatYouWillLearn)
            setValue("courseCategory", course.category)
            setValue("courseRequirements", course.instructions)
            setValue("courseImage", course.thumbnail)
        }

        getCategories();
    }, [])

    // Function to check if form is updated
    const isFormUpdated = () => {
        // get current values filled in the form
        const currentValues = getValues()
        // console.log("changes after editing form values:", currentValues)
        if (
          currentValues.courseTitle !== course.courseName ||
          currentValues.courseShortDesc !== course.courseDescription ||
          currentValues.coursePrice !== course.price ||
          currentValues.courseTags.toString() !== course.tag.toString() ||
          currentValues.courseBenefits !== course.whatYouWillLearn ||
          currentValues.courseCategory._id !== course.category._id ||
          currentValues.courseRequirements.toString() !==
            course.instructions.toString() ||
          currentValues.courseImage !== course.thumbnail
        ) {
          return true
        }
        return false
      }

    // handle next button click
    const onSubmit = async(data) => {
        // if we are editing an exiting course
        if(editCourse){
            // check if form is updated
            if (isFormUpdated()) {
                // get current values filled in the form
                const currentValues = getValues()

                const formData = new FormData()
                
                // append data to form data
                formData.append("courseId", course._id)
                if (currentValues.courseTitle !== course.courseName) {
                  formData.append("courseName", data.courseTitle)
                }
                if (currentValues.courseShortDesc !== course.courseDescription) {
                  formData.append("courseDescription", data.courseShortDesc)
                }
                if (currentValues.coursePrice !== course.price) {
                  formData.append("price", data.coursePrice)
                }
                if (currentValues.courseTags.toString() !== course.tag.toString()) {
                  formData.append("tag", JSON.stringify(data.courseTags))
                }
                if (currentValues.courseBenefits !== course.whatYouWillLearn) {
                  formData.append("whatYouWillLearn", data.courseBenefits)
                }
                if (currentValues.courseCategory._id !== course.category._id) {
                  formData.append("category", data.courseCategory)
                }
                if (
                  currentValues.courseRequirements.toString() !==
                  course.instructions.toString()
                ) {
                  formData.append(
                    "instructions",
                    JSON.stringify(data.courseRequirements)
                  )
                }
                if (currentValues.courseImage !== course.thumbnail) {
                  formData.append("thumbnailImage", data.courseImage)
                }
                
                setLoading(true)
    
                // API Call for edit course API
                const result = await editCourseDetails(formData, token)
    
                setLoading(false)
    
                if (result) {
                    // go to next step if updated successfully
                  dispatch(setStep(2))
                  dispatch(setCourse(result))
                }
            } 
            else {
                toast.error("No changes made to the form")
            }
            return
        }

        // If we are adding a new course for the first time
        const formData = new FormData()
        formData.append("courseName", data.courseTitle)
        formData.append("courseDescription", data.courseShortDesc)
        formData.append("price", data.coursePrice)
        formData.append("tag", JSON.stringify(data.courseTags))
        formData.append("whatYouWillLearn", data.courseBenefits)
        formData.append("category", data.courseCategory)
        formData.append("status", COURSE_STATUS.DRAFT)
        formData.append("instructions", JSON.stringify(data.courseRequirements))
        formData.append("thumbnailImage", data.courseImage)
        
        setLoading(true)

        // API Call for add course API
        const result = await addCourseDetails(formData, token)

        if (result) {
        dispatch(setStep(2))
        dispatch(setCourse(result))
        }
        setLoading(false)
    }


  return (
    <form
    onSubmit={handleSubmit(onSubmit)}
    className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">

        {/* Course Title */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseTitle">
            Course Title <sup className="text-pink-200">*</sup>
            </label>
            <input
            id="courseTitle"
            placeholder="Enter Course Title"
            {...register("courseTitle", { required: true })}
            className="form-style w-full"
            />
            {
                errors.courseTitle && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Course title is required
                </span>
                )
            }
        </div>

        {/* Course Short Description */}
        <div className='flex flex-col space-y-2'>
            <label htmlFor='courseShortDesc' className='text-sm text-richblack-5'>
                Course Short Description
                <sup className='text-pink-200'>*</sup>
            </label>
            <textarea
            id='courseShortDesc'
            placeholder='Enter Course Short Description'
            {...register('courseShortDesc', { required: true })}
            className='form-style resize-x-none min-h-[130px] w-full'></textarea>
            {
                errors.courseShortDesc && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course short description is required
                    </span>
                )
            }
        </div>

        {/* Course Price */}
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="coursePrice">
                Course Price <sup className="text-pink-200">*</sup>
            </label>
            <div className="relative">
                <input
                    id="coursePrice"
                    placeholder="Enter Course Price"
                    {...register("coursePrice", {
                    required: true,
                    valueAsNumber: true,
                    pattern: {
                        value: /^(0|[1-9]\d*)(\.\d+)?$/,
                    },
                    })}
                    className="form-style w-full !pl-12"
                />
                <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
            </div>
            {errors.coursePrice && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
                Course Price is required
            </span>
            )}
        </div>

        {/* Course Category */}
        <div className='flex flex-col space-y-2'>
            <label className='text-sm text-richblack-5' htmlFor='courseCategory'>
                Course Category <sup className="text-pink-200">*</sup>
            </label>
            <select
            id='courseCategory'
            defaultValue=""
            {...register('courseCategory', { required: true })}
            className='form-style w-full'>
                {/* default option value */}
                <option value="" disabled>Choose a category</option>

                {/* Fetch Catgeories from the API response */}
                {
                    !loading && couseCategories?.map((category, index) => (
                        <option key={index} value={category?._id}>{category?.name}</option>
                    ))
                }
            </select>
            {
                errors.courseCategory && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course category is required
                    </span>
                )
            }
        </div>

        {/* Course Tags Input */}
        <ChipInput
        name='courseTags'
        label='Tags'
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}></ChipInput>

        {/* Thumbnail Input */}
        <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}></Upload>

        {/* Benefits of the Course Section */}
        <div className='flex flex-col space-y-2'>
            {/* Label */}
            <label className='text-sm text-richblack-5' htmlFor='courseBenefits'>
                Course Benefits <sup className="text-pink-200">*</sup>
            </label>
            <textarea
            id='courseBenefits'
            placeholder='Enter Course Benefits'
            {...register('courseBenefits', { required: true })}
            className='form-style resize-x-none min-h-[130px] w-full'></textarea>
            {
                errors.courseBenefits && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course benefits is required
                    </span>
                )
            }
        </div>

        {/* Adding Requirement Fields */}
        <RequirementField
        name='courseRequirements'
        label='Requirements/Instructions'
        register={register}
        setValue={setValue}
        getValues={getValues}></RequirementField>

        {/* Buttons */}
        <div className='flex justify-end gap-x-2'>
            {
                // Continue Without Saving Button
                editCourse && (
                    // When we click on Continye without saving, we will go to the next step. hence, we will setStep(2)
                    <button
                    onClick={() => dispatch(setStep(2))}
                    className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>
                        Continue Without Saving
                    </button>
                )
            }
            {/* Next Button */}
            <IconButton
            text={!editCourse ? "Next" : "Save Changes"}></IconButton>
        </div>
    </form>
  )
}

export default CourseInformationForm