import React from 'react'
import CTAButton from "../../../components/core/HomePage/Button";
import { FaArrowRight } from "react-icons/fa";
import Instructor from "../../../assets/Images/Instructor.png";
import HighlightText from './HighlightText';

const InstructorSection = () => {
  return (
    <div>
        {/* Main Div */}
        <div className='flex flex-col lg:flex-row items-center gap-20'>
            {/* Left Div Image */}
            <div className="lg:w-[50%]">
                <img
                src={Instructor}
                alt=""
                className="shadow-white shadow-[-20px_-20px_0_0]"
                />
            </div>

            {/* Right Div Container*/}
            <div className='lg:w-[50%] flex flex-col gap-10'>
                {/* Headin */}
                <div className='lg:w-[50%] text-4xl font-semibold'>
                    Become an <HighlightText text={"Instructor"}></HighlightText>
                </div>

                {/* Subheading */}
                <p className="font-medium text-[16px] text-justify w-[90%] text-richblack-300">
                    Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
                </p>

                {/* Button */}
                <div className="w-fit">
                    <CTAButton active={true} linkto={"/signup"}>
                        <div className="flex items-center gap-3">
                        Start Teaching Today
                        <FaArrowRight />
                        </div>
                    </CTAButton>
                </div>
            </div>
        </div>
    </div>
  )
}

export default InstructorSection