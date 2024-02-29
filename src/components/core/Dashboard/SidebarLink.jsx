import React from 'react'

import * as Icons from 'react-icons/vsc'
import { useDispatch } from 'react-redux'
import { NavLink, matchPath, useLocation } from 'react-router-dom'

const SidebarLink = ({link, iconName}) => {
    // fetch Icon name
    const Icon = Icons[iconName]

    const location = useLocation();
    const dispatch = useDispatch();

    // Check if current route matches to show one Tab and not show the other tabs of the sidebar
    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname)
    }

  return (
    // Conditional Rendering of Tab
    // Show Yellow Bg when the tab is selected else show transparent bg
    <NavLink
    to={link.path}
    className=
    {`relative px-8 py-2 text-sm font-medium
    ${matchRoute(link.path) ? "bg-yellow-800 text-yellow-50" : "bg-opacity-0 text-richblack-300"}
    `}>
        {/* Show the Left bprder of selected tab only whne the route matches */}
        <span 
        className=
        {`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50
        ${matchRoute(link.path) ? "opacity-100" : "opacity-0"}`}></span>

        {/* Icon and Text of Nav Link */}
        <div className='flex items-center gap-x-2'>
            <Icon className='text-lg'></Icon>
            <p>{link.name}</p>
        </div>
    </NavLink>
  )
}

export default SidebarLink