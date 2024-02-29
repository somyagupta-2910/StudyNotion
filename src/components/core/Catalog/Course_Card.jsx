import React, { useEffect, useState } from 'react'
import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const Course_Card = ({course, Height}) => {

    // state variable for averageReviewCount
    const [averageReviewCount, setAverageReviewCount] = useState(0);

    useEffect(() => {
        // get average ratings from the util function for that course
        const count = GetAvgRating(course?.ratingAndReviews);
        // set the state variable accordingly
        setAverageReviewCount(count);
    })

  return (
    <>
        <Link to={`/courses/${course?._id}`}>
            <div>
                {/* Course Image */}
                <div className='rounded-lg'>
                    <img
                    src={course?.thumbnail}
                    alt="course thumnail"
                    className={`${Height} w-full rounded-xl object-cover `}>
                    </img>
                </div>

                {/* Course Details */}
                <div className='flex flex-col gap-2 px-1 py-3'>
                    {/* Course Name */}
                    <p className='text-xl text-richblack-5'>{course?.courseName}</p>

                    {/* Course Instructor */}
                    <p className='text-sm text-richblack-50'>
                        {course?.instructor?.firstName} {course?.instructor?.lastName}
                    </p>

                    {/* Course Rating and Reviews */}
                    <div className='flex items-center gap-1'>
                        {/* Show Review Average */}
                        <span className="text-yellow-5">{averageReviewCount || 0}</span>

                        <RatingStars Review_Count={averageReviewCount} />

                        {/* Show Ratings Count*/}
                        <span className='text-richblack-400'>{course?.ratingAndReviews?.length} Ratings</span>
                    </div>

                    {/* Course Price */}
                    <p className='text-richblack-50 text-cl'>Rs. {course?.price}</p>
                </div>
            </div>
        </Link>
    </>
  )
}

export default Course_Card