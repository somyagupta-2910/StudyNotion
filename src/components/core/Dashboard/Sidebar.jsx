import React from 'react'
import { VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useState } from 'react'

import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../../src/services/operations/authAPI"
import SidebarLink from './SidebarLink'
import ConfirmationModal from '../../common/ConfirmationModal'

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {user, loading: profileLoading} = useSelector((state) => state.profile)
    const {loading: authLoading} = useSelector((state) => state.auth)

    // State Variable to see if Confirmation modal should be displayed or not
    const [confirmationModal, setConfirmationModal] = useState(null);

    if(authLoading || profileLoading) {
        return(
            <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
                <div className="spinner"></div>
            </div>
        )
    }

  return (
    <div>
        {/* Sidebar Container */}
        <div className='flex flex-col min-w-[222px] border-r-[1px] border-r-richblack-700 h-[calc(100vh-3.5rem)] bg-richblack-800 py-10'>
            {/* Sidebar Links - First Half */}
            <div className='flex flex-col gap-y-5'>
                {
                    // This Map comproses My Profile, Enrolled Courses (for students)/Dashboard,My Course, Add Course for instructor() and Cart Tabs */}
                    sidebarLinks.map((link, index) => {
                        if(link.type && user?.accountType !== link.type){
                            return null
                        }
                        return (
                            <SidebarLink key={link.id} link={link}  iconName={link.icon}></SidebarLink>
                        )
                    })
                }
            </div>

            {/* Horizontal Line */}
            <div className='mx-auto w-10/12 my-6 h-[1px] bg-richblack-700'></div>

            {/* Setting and Logout Tab Container */}
            <div className='flex flex-col'>
                {/* Settings Tab Link */}
                <SidebarLink link={{name: "Settings", path: "/dashboard/settings"}} iconName={"VscSettings"}></SidebarLink>

                {/* Logout Button */}
                {/* When user clicks on logout, modal is displayed.
                When user clicks on Cancel button, modal is closed */}
                <button
                onClick={() => setConfirmationModal(
                    {
                        text1: "Are you sure you want to log out?",
                        text2: "You will be logged out of your account",
                        btn1Text: 'Logout',
                        btn2Text: 'Cancel',
                        btn1Handler: () => dispatch(logout(navigate)),
                        btn2Handler: () => setConfirmationModal(null)
                    }
                )}
                className='px-8 py-2 text-sm font-medium text-richblack-300'>

                    <div className='flex items-center gap-x-4'>
                        <VscSignOut className='text-lg'></VscSignOut>
                        <span>Logout</span>
                    </div>

                </button>
            </div>
        </div>
        {confirmationModal && <ConfirmationModal modalData={confirmationModal}></ConfirmationModal>}
    </div>
  )
}

export default Sidebar