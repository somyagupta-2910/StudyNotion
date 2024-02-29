import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import IconButton from '../../common/IconButton'
import { RiEditBoxLine } from "react-icons/ri"
import { formattedDate } from "../../../utils/dateFormatter"

const MyProfile = () => {
    const {user} = useSelector((state) => state.profile)
    const navigate = useNavigate();

  return (
    <div>
        {/* Heading */}
        <h1 className='text-3xl font-semibold mb-14 text-richblack-5'>
            My profile
        </h1>

        {/* Section 1 - Profile Picture, Name, and Email */}
        <div className='flex items-center justify-between rounded-md border-1px border-richblack-700 bg-richblack-800 p-8 px-12'>
            {/* Left Content */}
            <div className='flex items-center gap-x-4'>
                {/* Image */}
                <img
                src={user?.image}
                alt={`profile-${user?.firstName}`}
                className='aspect-square w-[75px] rounded-full object-cover'></img>
                {/* Text Container */}
                <div className='space-y-1'>
                    <p className='text-lg font-semibold text-richblack-5'>{user?.firstName + " " + user?.lastName}</p>
                    <p className="text-sm text-richblack-300">{user?.email}</p>
                </div>
            </div>

            {/* Right Edit Button */}
            <IconButton
            text={"Edit"}
            onClick={() => navigate("/dashboard/settings")}>
                <RiEditBoxLine />
            </IconButton>
        </div>

        {/* Section 2 - About */}
        {/* Main Container */}
        <div className='flex flex-col gap-y-10 justify-between rounded-md border-1px border-richblack-700 bg-richblack-800 p-8 px-12 my-10'>
            {/* Heading and About Div Container */}
            <div className='w-full flex items-center justify-between'>
                {/* Heading */}
                <h1 className='text-lg font-semibold text-richblack-5'>About</h1>

                {/* Right Edit Button */}
                {/* This button will take us to the settings page */}
                <IconButton
                text={"Edit"}
                onClick={() => navigate("/dashboard/settings")}>
                    <RiEditBoxLine />
                </IconButton>
            </div>

            {/* Parapgraph */}
            {/* We fetch about from user object or we can write something as default */}
            <p
            className={`${
                user?.additionalDetails?.about
                ? "text-richblack-5"
                : "text-richblack-400"
            } text-sm font-medium`}
            >
                {user?.additionalDetails?.about ?? "Write Something About Yourself"}
            </p>
        </div>

        {/* Section 3 - Personal Details */}
        <div className='flex flex-col gap-y-10 justify-between rounded-md border-1px border-richblack-700 bg-richblack-800 p-8 px-12'>
            {/* Heading and Edit Button Container */}
            <div className='w-full flex items-center justify-between'>
                {/* Heading */}
                <h1 className='text-lg font-semibold text-richblack-5'>Personal Details</h1>

                {/* Right Edit Button */}
                {/* This button will take us to the settings page */}
                <IconButton
                text={"Edit"}
                onClick={() => navigate("/dashboard/settings")}>
                    <RiEditBoxLine />
                </IconButton>
            </div>

            {/* Personal Details Div */}
            {/* Main Container for two columns - Flex row */}
            <div className="flex max-w-[500px] justify-between">
            {/* First Column */}
            <div className="flex flex-col gap-y-5">
                <div>
                    <p className="mb-2 text-sm text-richblack-600">First Name</p>
                    <p className="text-sm font-medium text-richblack-5">
                    {   user?.firstName}
                    </p>
                </div>
                <div>
                    <p className="mb-2 text-sm text-richblack-600">Email</p>
                    <p className="text-sm font-medium text-richblack-5">
                        {user?.email}
                    </p>
                </div>
                <div>
                    <p className="mb-2 text-sm text-richblack-600">Gender</p>
                    <p className="text-sm font-medium text-richblack-5">
                        {user?.additionalDetails?.gender ?? "Add Gender"}
                    </p>
                </div>
            </div>
            {/* Second Column */}
            <div className="flex flex-col gap-y-5">
                <div>
                    <p className="mb-2 text-sm text-richblack-600">Last Name</p>
                    <p className="text-sm font-medium text-richblack-5">
                        {user?.lastName}
                    </p>
                </div>
                <div>
                    <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
                    <p className="text-sm font-medium text-richblack-5">
                        {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
                    </p>
                </div>
                <div>
                    <p className="mb-2 text-sm text-richblack-600">Date Of Birth</p>
                    <p className="text-sm font-medium text-richblack-5">
                        {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                        "Add Date Of Birth"}
                    </p>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default MyProfile