import React from 'react'
import {FaArrowRight} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from '../components/core/HomePage/Button'
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import ExploreMore from '../components/core/HomePage/ExploreMore'
import Footer from '../components/common/Footer'

const Home = () => {
  return (
    <div>
        {/* Section 1 */}
        {/* Section 1 Container */}
        <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between gap-8'>
            <Link to={'/signup'}>
                {/* Button Div - Circular Border*/}
                <div className='mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 group transition-all duration-200 hover:scale-95 w-fit'>
                    {/* Button Inner Content Div, Flex the text and the arrow icon */}
                    <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                        <p>Become an Instructor</p>
                        <FaArrowRight></FaArrowRight>
                    </div>
                </div>
            </Link>

            {/* Heading Div */}
            <div className='text-4xl font-semibold'>
                Empower Your Future with<HighlightText text={"Coding Skills"}/>
            </div>

            {/* Subheading */}
            <div className='-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300'>
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
            </div>

            {/* Create Two Buttons */}
            <div className='flex flex-row gap-4'>
            {/* We will make the button as a component and re use it */}
                <CTAButton active={true} linkto={'/signup'}>
                    Learn More
                </CTAButton>

                <CTAButton active={false} linkto={'/signup'}>
                    Book a Demo
                </CTAButton>
            </div>

            {/* Display Banner Video */}
            <div className='shadow-[10px_-5px_50px_-5px] mx-3 my-12'>
                <video className="shadow-[20px_20px_rgba(255,255,255)]" muted loop autoPlay>
                    <source src={Banner} type='video/mp4'></source>
                </video>
            </div>

            {/* Text Block & Code Animated Block - Section 1 */}
            {/* Container */}
            <div>
                <CodeBlocks 
                position={"lg:flex-row"}
                heading={
                    <div className="w-[100%] text-4xl font-semibold">Unlock your <HighlightText text={"coding potential"}></HighlightText> with our online course</div>
                }
                subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
                ctabtn1={
                    {
                        btnText: "Try It Yourself",
                        linkto: "/signup",
                        active: true,
                    }
                }
                ctabtn2={
                    {
                        btnText: "Learn More",
                        linkto: "/signup",
                        active: false,
                    }
                }
                codeColor={"text-yellow-25"}
                codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                backgroundGradient={<div className="codeblock1 absolute"></div>}
                ></CodeBlocks>
            </div>

            <div>
                <CodeBlocks
                position={"lg:flex-row-reverse"}
                heading={<div className="w-[100%] text-4xl font-semibold">
                Start
                <HighlightText text={"coding in seconds"} />
                </div>}
                subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}
                ctabtn1={{
                    btnText: 'Continue Lesson',
                    linkto:'/signup',
                    active: true,
                }}
                ctabtn2={{
                    btnText: 'Learn More',
                    linkto:'/signup',
                    active: false,
                }}
                codeColor={"text-white"}
                codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                backgroundGradient={<div className="codeblock2 absolute"></div>}
                ></CodeBlocks>
            </div>

            {/* Card Layout Section */}
            <ExploreMore></ExploreMore>
        </div>

        {/* Section 2 */}
        {/* First Section */}
        <div className='bg-pure-greys-5 text-richblack-700'>
            {/* Background Image for the section */}
            <div className='homepage_bg h-[320px]'>
                <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto'>
                    {/* Add a Div to push the buttons below */}
                    {/* <div className='h-[200px]'></div> */}

                    {/* Buttons Div */}
                    <div className='flex flex-row gap-7 text-white my-[100px] lg:my-[200px]'>
                    {/* Button 1 */}
                        <CTAButton
                        linkto={'/signup'}
                        active={true}>
                            <div className='flex items-center gap-3'>
                                Explore Full Catalog
                                <FaArrowRight></FaArrowRight>
                            </div>
                        </CTAButton>
                        {/* Button 2 */}
                        <CTAButton
                        linkto={'/signup'}
                        active={false}>
                            <div className='flex items-center gap-3'>
                                Learn More
                            </div>
                        </CTAButton>
                    </div>
                </div>
            </div>

            {/* Section for Two side-by-side Text Divs and Left Text Div and Right Image */}
            {/* Main Container */}
            <div className='w-11/12 max-w-maxContent mx-auto flex flex-col items-center justify-between gap-8 mt-5 lg:mt-[25px]'>
                {/* Container for Two side-by-side divs. Job that is in demand container */}
                <div className='flex flex-col gap-7 items-center justify-between mb-10 -mt-[100px] lg:mt-20 lg:flex-row lg:gap-0'>
                    {/* First Text Div */}
                    <div className='text-4xl font-semibold lg:w-[45%]'>Get the skills you need for a <HighlightText text={'job that is in demand'}></HighlightText></div>

                    {/* Second Text and Button Div */}
                    <div className='flex flex-col items-start gap-10 lg:w-[40%]'>
                        {/* Text */}
                        <div className='text-[16px]'>
                            The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                        </div>

                        {/* Button */}
                        <CTAButton
                        active={true}
                        linkto={'/signup'}>
                            <div>
                                Learn More
                            </div>
                        </CTAButton>
                    </div>
                </div>
                {/* Text Div and Image side-by-side */}
                <TimelineSection></TimelineSection>

                <LearningLanguageSection></LearningLanguageSection>
            </div>
        </div>

        {/* Section 3 */}
        {/* Two Sub-sections */}
        {/* Main Container */}
        <div className='w-11/12 max-w-maxContent mx-auto my-20 flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>
            {/* First Subsection */}
            <InstructorSection></InstructorSection>

            {/* Second Subsection */}
            <h1 className="text-center text-4xl font-semibold mt-8">
                Reviews from other learners
            </h1>
            {/* <ReviewSlider></ReviewSlider> */}
        </div>

        {/* Footer */}
        <Footer></Footer>
    </div>
  )
}

export default Home


