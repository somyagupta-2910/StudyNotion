import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI"
import { resetCourseState, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"

import IconButton from "../../../../common/IconButton"

export default function PublishCourse() {
    // useForm hook
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
    } = useForm()

    // course and token from redux
    const {course} = useSelector((state) => state.course)
    const {token} = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // state variable for loader
    const [loading, setLoading] = useState(false)

    // During the first ender if the course status is published, then set the public checkbox to true
    useEffect(() => {
        if(course?.status === COURSE_STATUS.PUBLISHED) {
            setValue("public", true)
        }
    }, [])

    // go back to the previous step
    const goBack = () => {
        dispatch(setStep(2))
    }

    // go to Dashboard
    const goToCourses = () => {
        dispatch(resetCourseState())
        navigate("/dashboard/my-courses")
    }

    const handleCoursePublish = async () => {
        // This condition means, the form has not been updated.
        console.log('Entered handleCoursePublish')
        if((course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true )|| (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)) {
            // form has not been updated
            // no need to make api call
            // we will go to dashboard
            goToCourses()
            return
        }

        console.log('Form Update State')
        // form has been updated
        const formData = new FormData();
        formData.append('courseId', course._id)

        // set the course status
        const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT

        formData.append('status', courseStatus)

        setLoading(true)

        console.log('Editing course details API Call')
        // API call
        const result = await editCourseDetails(formData, token)

        // if updated successfully, go to dashboard
        if(result){
            goToCourses();
        }

        setLoading(false)
    }

    const onSubmit = async (data) => {
        console.log('Entered On Submit')
        handleCoursePublish()
    }
    return(
        <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
            {/* Heading */}
            <p className="text-2xl font-semibold text-richblack-5">Publish Settings</p>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Div for Checkbox */}
                <div className="my-6 mb-8">
                    {/* Label */}
                    <label
                    htmlFor="public" 
                    className="inline-flex items-center text-lg">
                        <input
                        type="checkbox"
                        id="public"
                        {...register("public")}
                        className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
                        />
                        <span className="ml-2 text-richblack-400">
                        Make this course as public
                        </span>
                    </label>

                </div>

                {/* Back and Save Changes Button Div */}
                <div className="ml-auto flex max-w-max gap-x-4 ">
                    {/* Back Button */}
                    <button 
                    disabled={loading}
                    type="button"
                    onClick={goBack} className="cursor-pointer rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900">
                        Back
                    </button>

                    {/* Save Changes Button */}
                    <IconButton
                    text='Save Changes'
                    disabled={loading}></IconButton>
                </div>
            </form>
        </div>
    )
}