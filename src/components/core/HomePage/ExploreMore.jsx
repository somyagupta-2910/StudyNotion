import React, { useState } from 'react'

import { HomePageExplore } from "../../../data/homepage-explore";
import CourseCard from "./CourseCard";
import HighlightText from "./HighlightText";

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths",
];

const ExploreMore = () => {
    // By default, the first tab is selected
    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    // by default get the first index's courses. Courses are the ones that fill up the Cards
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value) => {
        setCurrentTab(value);
        // In the HomePageExplore JSOn, search for tag value which is equal to the valeu (tag) passed here
        const result = HomePageExplore.filter((course) => course.tag === value);
        // set the courses
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }

    return (
        <div>
            {/* Main Container */}
            <div>
                <div className="text-4xl font-semibold text-center my-10">
                Unlock the
                <HighlightText text={"Power of Code"} />
                <p className="text-center text-richblack-300 text-lg font-semibold mt-1">
                    Learn to Build Anything You Can Imagine
                </p>
                </div>
            </div>

            {/* Tab Section */}
            <div className='hidden lg:flex gap-1 items-center rounded-full bg-richblack-800 my-5 border-richblack-100 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] p-1'>
                {
                    tabsName.map((element, index) => {
                        return(
                            // currentTab === element will check if the current element is the same as the current tab, if yes, then the following css properties will be defined
                            <div className={`text-16px ${currentTab === element ? "bg-richblack-900 text-richblack-5 font-medium" : "text-richblack-200"} rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-5 py-3`} 
                            key={index} 
                            onClick={() => setMyCards(element)}
                            >
                                {element}
                            </div>
                        )
                    })
                }
            </div>

            {/* Adding this div for extra spacing between the tabs and the cards */}
            <div className="hidden lg:block lg:h-[200px]"></div>

            {/* Cards Section */}
            <div className='lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3'>
                {
                    courses.map((element, index) => {
                        return(
                            <CourseCard 
                                key={index}
                                cardData={element}
                                currentCard={currentCard}
                                setCurrentCard={setCurrentCard} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ExploreMore