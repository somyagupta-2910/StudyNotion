import React from 'react'
import { useSelector } from 'react-redux'
import RenderCartCourses from './RenderCartCourses'
import RenderTotalAmount from './RenderTotalAmount'

export default function Cart () {
    // get the total number of items from cart slice
    const {total, totalItems} = useSelector((state) => state.cart)

  return (
    <div>
        {/* Heading */}
        <h1 className='mb-14 text-3xl font-medium text-richblack-5'>Your Cart</h1>

        {/* Total Courses in Cart */}
        <p className='border-b border-b-richblack-400 pb-2 font-semibold text-richblack-400'>{totalItems} Courses in Cart</p>

        {/* Render Cart Courses and Total Amount */}
        {
            total > 0
            ? (<div className='mt-8 flex flex-col-reverse lg:flex-row items-start gap-x-10 gap-y-6'>
                {/* If total no. of courses in the cart are greater than zero, then render them */}
                <RenderCartCourses></RenderCartCourses>
                <RenderTotalAmount></RenderTotalAmount>
            </div>)
            : (<p className='mt-14 text-center text-3xl text-richblack-100'>Your Cart is Empty</p>)
        }
    </div>
  )
}