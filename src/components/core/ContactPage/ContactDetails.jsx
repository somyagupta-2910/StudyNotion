import React from 'react'

import * as Icon1 from "react-icons/bi"
import * as Icon3 from "react-icons/hi2"
import * as Icon2 from "react-icons/io5"

const contactDetails = [
    {
      icon: "HiChatBubbleLeftRight",
      heading: "Chat on us",
      description: "Our friendly team is here to help.",
      details: "info@studynotion.com",
    },
    {
      icon: "BiWorld",
      heading: "Visit us",
      description: "Come and say hello at our office HQ.",
      details:
        "Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016",
    },
    {
      icon: "IoCall",
      heading: "Call us",
      description: "Mon - Fri From 8am to 5pm",
      details: "+123 456 7869",
    },
  ]

const ContactDetails = () => {
  return (
    <div className='bg-richblack-800 rounded-xl p-4 lg:p-6 flex flex-col gap-6'>
        {
            contactDetails.map((detail, index) => {
                
                let Icon = Icon1[detail.icon] || Icon2[detail.icon] || Icon3[detail.icon];
                
                return (
                    // Container for each individual detail */}
                    <div key={index} className='flex flex-col gap-[2px] text-richblack-200'>
                        {/* icon and Heading Container */}
                        <div className='flex gap-4 items-center'>
                            {/* Icon */}
                            <Icon size={25}></Icon>
                            {/* Heading */}
                            <h3 className='text-richblack-5 text-lg font-semibold'>
                                {detail.heading}
                            </h3>
                        </div>  

                        {/* Description */}
                        <p className='font-medium'>
                            {detail.description}
                        </p>

                        {/* Details */}
                        <p className='font-semibold'>
                            {detail.details}
                        </p>
                    </div>
                )
                    
            })
        }
    </div>
  )
}

export default ContactDetails