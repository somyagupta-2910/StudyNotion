import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const VideoDetailsSidebar = () => {
    // state variable to highlight the section when it is selected
    const [activeStatus, setActiveStatus] = useState("")
    // state variable to highlight the video when it is selected
    const [videobarActive, setVideoBarActive] = useState("")
    // get data from url
    const {sectionId, subSectionId} = useParams()
    // get data from slices
    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures,
    } = useSelector((state) => state.viewCourse)

  return (
    <div>VideoDetailsSidebar</div>
  )
}

export default VideoDetailsSidebar