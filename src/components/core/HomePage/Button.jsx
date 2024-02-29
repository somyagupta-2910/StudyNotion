import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({children, active, linkto}) => {
  return (
    // linkTo is the link to which the button will take us to
    <Link to={linkto}>
        {/* active will let us know if the button color should be yellow or black */}
        <div className={`text-center text-[13px] px-6 py-3 rounded-md font-bold 
        ${active ? "bg-yellow-50 text-black" : "bg-richblack-800 text-white"}
        hover:scale-95 transition-all duration-200
        `}>
            {/* children is the content of the button */}
            {children}
        </div>
    </Link>
  )
}

export default Button