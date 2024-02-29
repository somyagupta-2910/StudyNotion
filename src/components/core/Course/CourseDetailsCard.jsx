import React from 'react'
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { addToCart } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"

const CourseDetailsCard = ({course, setConfirmationModal, handleBuyCourse}) => {
    const {user} = useSelector((state) => state.profile)
    const {token} = useSelector((state) => state.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        thumbnail: ThumbnailImage,
        price: CurrentPrice,
        _id: courseId,
      } = course

      const handleAddToCart = () => {
          if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR){
              toast.error("You are an instructor. You cannot add courses")
          }

          // add to cart if user is logged in and is a student
          if(token){
            dispatch(addToCart(course));
            return
          }

          // open confirmation modal if user is not logged in
          setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to add To Cart",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null),
          })
      }

      // copy link to clipboard using copy-to-clipboard library
      const handleShare = () => {
          copy.window.location.href();
          toast.success("Link copied to clipboard")
      }

  return (
    <div className='flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5'>
        {/* Course Thumbnail */}
        <img
        src={ThumbnailImage}
        alt="course thumnail"
        className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        >
        </img>
        
        <div className='px-4'>
            {/* Course Price */}
            <div className='space-x-3 pb-4 text-3xl font-semibold'>
                Rs. {CurrentPrice}
            </div>

            {/* Buttons Div */}
            <div className='flex flex-col gap-4'>
                {/* Buy Now Button */}
                <button
                className='yellowButton'
                onClick={
                    user && course?.studentsEnrolled.includes(user?._id) 
                    ? () => navigate(`/dashboard/enrolled-courses/`) 
                    : () => handleBuyCourse
                }>
                    {
                        // If user is already enrolled in the course show go to course button else show buy now
                        user && course?.studentsEnrolled.includes(user?._id) ? "Go to Course" : "Buy Now"
                    }
                </button>

                {/* Add to Cart */}
                {
                    // Show Add to Cart button only when the user is not enrolled
                    (!user || !course?.studentsEnrolled.includes(user?._id)) && (
                        <button onClick={handleAddToCart} className="blackButton">
                            Add to Cart
                        </button>
                    )
                }
            </div>

            <div>
                <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
                30-Day Money-Back Guarantee
                </p>
            </div>

            <div>
                <p className={`my-2 text-xl font-semibold `}>
                    This Course Includes :
                </p>
                {/* Course Instructions */}
                <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
                    {
                        course?.instructions?.map((item, i) => {
                            return (
                                <p className={`flex gap-2`} key={i}>
                                <BsFillCaretRightFill />
                                <span>{item}</span>
                                </p>
                            )
                        })
                    }
                </div>
            </div>

            {/* Share Button */}
            <div className="text-center">
                <button
                className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
                onClick={handleShare}
                >
                <FaShareSquare size={15} /> Share
                </button>
            </div>
        </div>
    </div>
  )
}

export default CourseDetailsCard