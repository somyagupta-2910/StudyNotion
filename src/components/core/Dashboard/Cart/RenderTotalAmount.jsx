import React from 'react'

import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import IconButton from '../../../common/IconButton'

import { buyCourse } from "../../../../services/operations/studentFeaturesAPI"

const RenderTotalAmount = () => {
    // get total amount in cart from cart slice
    const { total, cart } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBuyCourse = () => {
        // get all the courses that you want to buy
        const courses = cart.map((course) => course._id);
        // call buyCourse API to buy the courses
        buyCourse(token, courses, user, navigate, dispatch);
    }

  return (
    <div className='min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6'>
        <p className='mb-1 text-sm font-medium text-richblack-300'>Total: </p>
        <p className='mb-6 text-3xl font-medium text-yellow-100'>₹ {total}</p>

        <IconButton
        text="Buy Now"
        onClick={handleBuyCourse}
        className="w-full justify-center"></IconButton>
    </div>
  )
}

export default RenderTotalAmount