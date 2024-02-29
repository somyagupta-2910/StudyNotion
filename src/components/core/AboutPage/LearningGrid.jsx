import React from 'react'
import HighlightText from "../../../components/core/HomePage/HighlightText";
import CTAButton from "../../../components/core/HomePage/Button";

const LearningGridArray = [
    {
      order: -1,
      heading: "World-Class Learning for",
      highlightText: "Anyone, Anywhere",
      description:
        "Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
      BtnText: "Learn More",
      BtnLink: "/",
    },
    {
      order: 1,
      heading: "Curriculum Based on Industry Needs",
      description:
        "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
    },
    {
      order: 2,
      heading: "Our Learning Methods",
      description:
        "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
    {
      order: 3,
      heading: "Certification",
      description:
        "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
    {
      order: 4,
      heading: `Rating "Auto-grading"`,
      description:
        "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
    {
      order: 5,
      heading: "Ready to Work",
      description:
        "Studynotion partners with more than 275+ leading universities and companies to bring",
    },
  ];

const LearningGrid = () => {
  return (
    // Container for the entire grid
    <div className='mx-auto w-[300px] xl:w-fit grid grid-cols-1 xl:grid-cols-4 mb-12'>
        {
            LearningGridArray.map((card, index) => (
                // Div container for each individual grid element
                <div 
                    key={index}
                    className={
                        // For the first element, the column span is 2
                        // For odd order elements, the background is greyish
                        // For even order elements, the background is blackish
                        // For the third elememnt, the element starts from the second column
                        `${index === 0 && "h-[410px] xl:col-span-2 xl:h-[294px]"}
                        ${card.order%2 === 1 
                            ? "bg-richblack-700 h-[294px]" 
                            : "bg-richblack-800 h-[294px]"
                        }
                        ${card.order === 3 && "xl:col-start-2"}
                        ${card.order < 0 && "bg-transparent"}
                        `
                    }
                >
                    {
                        // Conditional Rendering
                        card.order < 0 ? (
                            // Container for the First Special Div
                            <div className='xl:w-[90%] flex flex-col gap-4 p-10'>

                                {/* Heading */}
                                <div className='text-lg xl:text-2xl font-semibold'>
                                    {card.heading}
                                    <HighlightText text={card.highlightText} />
                                </div>

                                {/* Description */}
                                <p className='font-medium text-richblack-300'>
                                    {card.description}
                                </p>

                                {/* Button */}
                                <CTAButton
                                linkto={card.BtnLink}
                                active={true}
                                >
                                    {card.BtnText}
                                </CTAButton>
                            </div>
                        ) : (
                            // Continaer for rest of the divs
                            <div className='flex flex-col p-8 gap-8'>

                                {/* Heading */}
                                <h1 className='text-lg text-richblack-5'>   
                                    {card.heading}
                                </h1>

                                {/* Description */}
                                <p className='font-medium text-richblack-300'>
                                    {card.description}
                                </p>
                            </div>
                        )
                    }
                </div>
            ))
        }
    </div>
  )
}

export default LearningGrid