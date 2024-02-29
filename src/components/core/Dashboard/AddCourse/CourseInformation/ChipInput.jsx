import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { MdClose } from "react-icons/md"

const ChipInput = ({name, label, placeholder, register, errors, setValue, getValues}) => {

    const {course, editCourse} = useSelector((state) => state.course)

    // state variable for tag list
    const [chips, setChips] = useState([]);

    // render existing tags on first render
    useEffect(() => {
        // if we are editing the course, then add the existing tag values of the course to the state variable
        if(editCourse){
            setChips(course?.tag)
        }

        register(name, { required: true, validate: (value) => value.length > 0 })
    }, [])

    // update any time there is a change in the state variable
    useEffect(() => {
        setValue(name, chips)
    }, [chips])

    // Function to handle addition of a chip on pressing enter
    const handleAddChip = (event) => {
        // If the enter key is pressed and there is a value in the input field
        if (event.key === "Enter" && event.target.value) {
            //event.preventDefault()
            
            // Get the input value and remove any leading/trailing spaces
            const chipValue = event.target.value.trim()

            // Check if the input value exists and is not already in the chips array
            if (chipValue && !chips.includes(chipValue)) {
                // Add the chip to the array and clear the input
                const newChips = [...chips, chipValue]
                setChips(newChips)
                event.target.value = ""
            }
        }
    }


    // Function to handle deletion of a chip
    const handleDeleteChip = (chipIndex) => {
        // Filter the chips array to remove the chip with the given index
        const newChips = chips.filter((_, index) => index !== chipIndex)
        setChips(newChips)
    }

  return (
    <div className='flex flex-col space-y-2'>
        {/* Label */}
        <label className='text-sm text-richblack-5' htmlFor={name}>
            {label} <sup className="text-pink-200">*</sup>
        </label>
        
        {/* Add Tags one after the other when entered */}
        <div className='w-full flex flex-wrap gap-2'>
            {
                chips?.map((chip, index) => (
                    <div key={index} className='m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5'>    
                        {chip}

                        {/* Delete button */}
                        <button
                        type='button'
                        onClick={() => handleDeleteChip(index)}
                        className="ml-2 focus:outline-none">
                            <MdClose className="text-sm" />
                        </button>
                    </div>
                ))
            }
            <input
            type='text'
            id={name}
            name={name}
            placeholder={placeholder}
            onKeyDown={handleAddChip}
            className='form-style w-full'
            />
        </div>
        {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}

export default ChipInput