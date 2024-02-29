import React from 'react'
import HighlightText from '../components/core/HomePage/HighlightText'
import FoundingStory from "../assets/Images/FoundingStory.png"
import BannerImage1 from "../assets/Images/aboutus1.webp"
import BannerImage2 from "../assets/Images/aboutus2.webp"
import BannerImage3 from "../assets/Images/aboutus3.webp"
import Quote from '../components/core/AboutPage/Quote'
import StatsComponent from '../components/core/AboutPage/StatsComponent'
import LearningGrid from '../components/core/AboutPage/LearningGrid'
import ContactFormSection from '../components/core/AboutPage/ContactFormSection'
import Footer from '../components/common/Footer'

const About = () => {
  return (
    <div>
        {/* Section 1 */}
        {/* Section 1 Background Container */}
        <section className='bg-richblack-700'>
            {/* Section 1 Content Container */}
            <div className='mx-auto w-11/12 flex flex-col relative justify-between gap-10 text-center text-white'>
                {/* Heading */}
                <header className='text-4xl font-semibold mx-auto py-20 lg:w-[70%]'>
                    Driving Innovation in Online Education for a
                    <HighlightText text={"Brighter Future"} />

                    {/* Subheading */}
                    <p className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]">
                        Studynotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.
                    </p>
                </header>

                {/* Spacing Div Container */}
                <div className="sm:h-[70px] lg:h-[150px]"></div>

                {/* Image Container */}
                <div className='absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5'>
                    <img src={BannerImage1} alt="" />
                    <img src={BannerImage2} alt="" />
                    <img src={BannerImage3} alt="" />
                </div>  
            </div>
        </section>

        {/* Section 2 */}
        {/* Section 2 Background Container */}
        <section className='border-b border-richblack-700'>
            {/* Container for Quote */}
            <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
                {/* Empty Container */}
                <div className="h-[100px] "></div>
                {/* Quote */}
                <Quote />
            </div>
        </section>

        {/* Section 3 */}
        <section>
            {/* Section 3 Container */}
            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col justify-between gap-10 text-richblack-500'>

                {/* First Box Div - Founding Story Div */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

                    {/* Left Content Box */}
                    <div className="flex flex-col gap-10 my-24 lg:w-[50%]">
                        {/* Heading */}
                        <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%]">
                            Our Founding Story
                        </h1>
                        
                        {/* Paragraph - 1 */}
                        <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                            Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.
                        </p>

                        {/* Paragraph - 2 */}
                        <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                            As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.
                        </p>
                    </div>

                    {/* Right Image Box */}
                    <div>
                        <img
                            src={FoundingStory}
                            alt=""
                            className="shadow-[0_0_20px_0] shadow-[#FC6767]"
                        />
                    </div>
                </div>

                {/* Second Box Div - Visiona and Mission Div */}
                <div className="flex flex-col items-center lg:flex-row justify-between lg:gap-10">

                    {/* Left Text Box Div */}
                    <div className="flex flex-col gap-10 my-24 lg:w-[40%]">
                        {/* Heading */}
                        <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                            Our Vision
                        </h1>

                        {/* Paragraph */}
                        <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                            With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.
                        </p>
                    </div>

                     {/* Right Text Box Div */}
                     <div className="flex flex-col gap-10 my-24 lg:w-[40%]">
                        {/* Heading */}
                        <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">
                            Our Mission
                        </h1>

                        {/* Paragraph */}
                        <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                            Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* Section 4 */}
        {/* Stats Component */}
        <StatsComponent></StatsComponent>

        {/* Section 5 - Grid Component */}
        <section className='w-11/12 max-w-maxContent mx-auto my-20 flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white relative'>
            <LearningGrid></LearningGrid>
            <ContactFormSection></ContactFormSection>
        </section>

        {/* Section 6 - Review Slider */}

        {/* Section 7 - Footer */}
        <Footer></Footer>
    </div>
  )
}

export default About