import React from 'react'

const Stats = [
    { count: "5K", label: "Active Students" },
    { count: "10+", label: "Mentors" },
    { count: "200+", label: "Courses" },
    { count: "50+", label: "Awards" },
];

const StatsComponent = () => {
  return (
    // Background Color Div
    <div className='bg-richblack-700'>
        {/* Stats Container for width */}
        <div className='mx-auto w-11/12 max-w-maxContent flex flex-col justify-between gap-10 text-white'>
            {/* Container for the stats elements */}
            <div className='grid grid-cols-2 md:grid-cols-4 text-center'>
                {
                    Stats.map((stat, index) => (
                        // Div container for each individual stat element
                        <div key={index} className='flex flex-col items-center py-10'>
                            <h3 className='text-[30px] font-bold text-richblack-5'>{stat.count}</h3>
                            <p className='font-semibold text-[16px] text-richblack-500'>{stat.label}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default StatsComponent