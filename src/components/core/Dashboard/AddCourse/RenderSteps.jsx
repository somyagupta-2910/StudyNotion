import React from 'react'
import { useSelector } from 'react-redux'
import { FaCheck } from "react-icons/fa"
import CourseInformationForm from "./CourseInformation/CourseInformationForm"
import CourseBuilderForm from "./CourseBuilderForm/CourseBuilderForm"

import PublishCourse from "./PublishCourse"

const RenderSteps = () => {
    // slice for step of course addition
    const { step } = useSelector((state) => state.course)

    const steps = [
        {
          id: 1,
          title: "Course Information",
        },
        {
          id: 2,
          title: "Course Builder",
        },
        {
          id: 3,
          title: "Publish",
        },
      ]

  return (
    <>
        <div className='relative mb-2 flex w-full justify-center'>
            {
                steps.map((item) => (
                    <>  
                        {/* If the step is equal to the current step, then highlight it with yellow color */}
                        <div 
                        className="flex flex-col items-center " 
                        key={item.id}>
                            {/* Step Button */}
                            <button
                            className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px] 
                            ${step === item.id
                            ? "border-yellow-50 bg-yellow-900 text-yellow-50"
                            : "border-richblack-700 bg-richblack-800 text-richblack-300"} 
                            ${step > item.id && "bg-yellow-50 text-yellow-50"} `}
                            >
                                {/* // If the step is greater than the current step, then show the Tick icon or else just show the step number */}
                                {
                                    step > item.id 
                                    ? (<FaCheck className="text-richblack-900 font-bold" />) : (item.id)
                                }
                            </button>    
                        </div>
                        {/* Dashes between steps */}
                        {
                            // item.id !=== steps.length means if the current step is not the last step, then add a dash
                            item.id !== steps.length && (
                            <>
                                <div
                                className={`h-[calc(34px/2)] w-[33%]  border-dashed border-b-2 ${
                                step > item.id  ? "border-yellow-50" : "border-richblack-500"
                                } `}
                                ></div>
                            </>)
                        }
                    </>
                ))
            }
        </div>

        {/* Form Title*/}
        <div 
        className="relative mb-16 flex w-full select-none justify-between">
            {
                steps.map((item) => (
                    <>
                        <div 
                        className="flex min-w-[130px] flex-col items-center gap-y-2"
                        key={item.id}>
                            <p 
                            className={`text-sm 
                            ${step >= item.id 
                            ? "text-richblack-5" 
                            : "text-richblack-500"
                            }`}>
                                {item.title}
                            </p>
                        </div>
                     </>
                    )
                )
            }
        </div>
        {/* Form Information */}
        {
            step === 1 && <CourseInformationForm></CourseInformationForm>
        }
        {
            step === 2 && <CourseBuilderForm></CourseBuilderForm>
        }
        {
            step === 3 && <PublishCourse></PublishCourse>
        }
    </>
  )
}

export default RenderSteps