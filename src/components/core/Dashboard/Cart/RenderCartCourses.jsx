import React from 'react'
import { FaStar } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"
import ReactStars from "react-rating-stars-component"
import { useDispatch, useSelector } from "react-redux"

import { removeFromCart } from "../../../../slices/cartSlice"

const RenderCartCourses = () => {
    // get cart data from the slice
    const {cart} = useSelector((state) => state.cart)
    const dispatch = useDispatch()

  return (
    // Main Courses Cart Container
    <div className='flex flex-col flex-1'>
        {
            cart.map((course, index) => (
                // Individual Course Cart Div
                <div key={index} className='w-full flex flex-wrap items-start justify-between gap-6 '>
                    <div className='flex flex-1 flex-col xl:flex-row gap-4'>
                        {/* Course Thumbnail */}
                        <img
                        src={course?.thumbnail}
                        alt={course?.courseName}
                        className='h-[148px] w-[220px] rounded-lg object-cover'></img>

                        {/* Div for Course name, Category Name, Reviews, and Course Level */}
                        <div className='flex flex-col space-y-1'>
                            {/* Course Name */}
                            <p className='text-lg font-medium text-richblack-5'>{course?.courseName}</p>

                            {/* Category */}
                            <p className='text-sm text-richblack-300'>
                                {course?.category?.name}
                            </p>

                            {/* Review Div */}
                            <div className='flex items-center gap-1'>

                                {/* rating */}
                                <span className="text-yellow-5">4.5</span>
                                {/* Star icon */}
                                <ReactStars
                                count={5}
                                value={course?.ratingAndReviews?.length}
                                size={20}
                                edit={false}
                                activeColor="#ffd700"
                                emptyIcon={<FaStar />}
                                fullIcon={<FaStar />}
                                />

                                {/* Number of reviews */}
                                <span className="text-richblack-400">
                                    {course?.ratingAndReviews?.length} Ratings
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Div for Price and Remove Cart Button */}
                    <div className="flex flex-col items-end space-y-2">
                        {/* Remove Cart Button */}
                        <button
                        onClick={() => dispatch(removeFromCart(course._id))}
                        className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200"
                        >
                            <RiDeleteBin6Line />
                            <span>Remove</span>
                        </button>

                        {/* Price */}
                        <p className="mb-6 text-3xl font-medium text-yellow-100">
                            ₹ {course?.price}
                        </p>
                    </div>
                </div>
            ))
        }
    </div>
  )
}

export default RenderCartCourses