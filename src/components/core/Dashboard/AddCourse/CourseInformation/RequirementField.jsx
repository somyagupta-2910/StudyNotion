import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'


const RequirementField = ({name, label, register, errors, setValue, getValues}) => {
    const { editCourse, course } = useSelector((state) => state.course)

    // state variables for requirement and requirements list
    const [requirement, setRequirement] = useState("");
    const [requirementList, setRequirementList] = useState([]);

    

    // register on first render
    useEffect(() => {
        // if we are modifying an existing course, then populate the requirements field with the initial value
        if(editCourse){
            setRequirementList(course?.instructions)
        }
        register(name, { 
            required: true, 
            validate: (value) => value.length > 0 
        })
    }, [])

    // whenever requirement list is updated, set it in the form
    useEffect(() => {
        setValue(name, requirementList)
    }, [requirementList])

    // function for adding requirement
    const handleAddRequirement = () => {
        if(requirement){
            // append the requirement to the list
            setRequirementList([...requirementList, requirement])
            // reset requirement
            setRequirement("")
        }
    }

    // function for removing requirement
    const handleRemoveRequirement = (index) => {
        const updatedRequirements = [...requirementList]
        updatedRequirements.splice(index, 1)
        setRequirementList(updatedRequirements)
    }

  return (
    <div className='flex flex-col space-y-2'>
        {/* label */}
        <label className='text-sm text-richblack-5' htmlFor={name}>
            {label} <sup className="text-pink-200">*</sup>
        </label>

        {/* requirement input Div*/}
        <div className='flex flex-col items-start space-y-2'>
            {/* Input field to insert the requirement text */}
            <input
            type='text'
            id={name}
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}className='form-style w-full'></input>

            {/* Button to insert the requirement into the requirement list*/}
            <button
            type='button'
            onClick={handleAddRequirement}
            className='font-semibold text-yellow-50'>
                Add
            </button>
        </div>
        {
            requirementList.length > 0 && (
                // list of requirements
                <ul className='flex flex-col space-y-1'>
                    {
                        requirementList.map((req, index) => (
                            <li className='flex items-center text-richblack-5' key={index}>
                                <span>{req}</span>
                                {/* Button to remove the requirement */}
                                <button
                                type='button'
                                onClick={() => handleRemoveRequirement(index)}
                                className='ml-2 text-xs text-pure-greys-300'>
                                    Clear
                                </button>
                            </li>
                            
                        ))
                    }
                </ul>
            )
        }
        
    </div>
  )
}

export default RequirementField