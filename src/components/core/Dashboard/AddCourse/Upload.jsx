import React, { useState, useEffect, useRef } from 'react'

import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { useSelector } from "react-redux"

import "video-react/dist/video-react.css"
import { Player } from "video-react"

const Upload = ({name, label, register, errors, setValue, editData=null, video=false, viewData=null}) => {

    // 
  const { course } = useSelector((state) => state.course)

  // state variable for image/video
  const [selectedFile, setSelectedFile] = useState(null)
  // state variable for preview of the file. It stores the url
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  )
  const inputRef = useRef(null)

  // function for handling file upload
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
    // call the previewFile function
      previewFile(file)
      // set the selected file in the state
      setSelectedFile(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
  })

  // function to read the dropped file
  const previewFile = (file) => {
    // console.log(file)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
        // attach the file url to the preview source state
      setPreviewSource(reader.result)
    }
  }

  // registers the name prop with the form validation (register function)
  useEffect(() => {
    register(name, { required: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register])

  // updates the form's value (setValue) whenever selectedFile changes.
  useEffect(() => {
    setValue(name, selectedFile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, setValue])

  return (
    <div className="flex flex-col space-y-2">
      {/* label */}
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>
      {/* Main Upload Div */}
      <div
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >
        {/* If Image is uploaded, show preview */}
        {
            previewSource ? (
                <div className="flex w-full flex-col p-6">
                    {/* If it is an image, use image tag to display */}
                    {
                        !video ? (
                            <img
                            src={previewSource}
                            alt="Preview"
                            className="h-full w-full rounded-md object-cover"
                            />
                        ) : (
                            // if it is a video, use Player tag to play the video
                            <Player aspectRatio="16:9" playsInline src={previewSource} />
                        )
                    }
                    {/* Cancel button - When it is cliked, it will clear the preview, remove the file and make the form value as null */}
                    {/* It is visible only when the file is uploaded */}
                    {
                        !viewData && (
                            <button
                            type="button"
                            onClick={() => {
                            setPreviewSource("")
                            setSelectedFile(null)
                            setValue(name, null)
                            }}
                            className="mt-3 text-richblack-400 underline">
                                Cancel
                            </button>
                        )
                    }
                </div>
            ) : (
                // Input field for dropping the file - Div
                <div className="flex w-full flex-col items-center p-6" {...getRootProps()}>
                    {/* File Input Field */}
                    <input {...getInputProps()} ref={inputRef} />

                    <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
                        {/* File Upload Cloud Icon */}
                        <FiUploadCloud className="text-2xl text-yellow-50" />
                    </div>

                    {/* Text */}
                    <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
                        Drag and drop an {!video ? "image" : "video"}, or click to{" "}
                        <span className="font-semibold text-yellow-50">Browse</span> a
                        file
                    </p>

                    <ul className="mt-10 flex list-disc justify-between space-x-12 text-center  text-xs text-richblack-200">
                        <li>Aspect ratio 16:9</li>
                        <li>Recommended size 1024x576</li>
                    </ul>
                </div>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}

export default Upload