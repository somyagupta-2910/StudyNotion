import React from 'react'
import IconButton from './IconButton'

const ConfirmationModal = ({modalData}) => {
  return (
    // Background Color Div
    <div className='fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm'>
        {/* Modal Container Div */}
        <div className='w-11/12 max-w-[350px] mx-auto rounded-lg border border-richblack-400 bg-richblack-800 p-6'>
            {/* Text 1 */}
            <p className='text-2xl font-semibold text-richblack-5'>
                { modalData.text1}
            </p>

            {/* Text 2 */}
            <p className='mt-5 mb-3 text-richblack-200 leading-6'>
                { modalData.text2}
            </p>

            <div className='flex items-center gap-x-4'>
                {/* Button 1 */}
                <button
                onClick={modalData?.btn1Handler}
                className='cursor-pointer rounded-md bg-yellow-50 py-[8px] px-[20px] font-semibold text-richblack-900'>
                    {modalData?.btn1Text}
                </button>

                {/* Button 2 */}
                <button
                onClick={modalData?.btn2Handler}
                className='cursor-pointer rounded-md bg-richblack-200 py-[8px] px-[20px] font-semibold text-richblack-900'>
                    {modalData?.btn2Text}
                </button>
            </div>
        </div>
    </div>
  )
}

export default ConfirmationModal