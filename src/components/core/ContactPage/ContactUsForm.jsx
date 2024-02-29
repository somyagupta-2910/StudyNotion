import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { apiConnector } from '../../../services/apiconnector'
import { contactusEndpoint } from '../../../services/apis'
import CountryCode from "../../../data/countrycode"

const ContactUsForm = () => {
    const [loading, setLoading] = useState(false)

    // useFormHook for form handling
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful },
      } = useForm();

      const submitContactUsForm = async (data) => {
          try{
            setLoading(true);

            // Send data to backend
            const response = await apiConnector("POST", contactusEndpoint.CONTACT_US_API, data);

            console.log(response);

            setLoading(false);
          }
          catch(error){
            console.log("ERROR MESSAGE - ", error.message)
            setLoading(false)
          }
      }

    // useEffect to reset the form on successful submission
    useEffect(() => {
        if(isSubmitSuccessful) {
            reset({
                firstname: '',
                lastname: '',
                email: '',
                message: '',
                phoneNo: '',
            })
        }
    }, [reset, isSubmitSuccessful])

  return (
    <form onSubmit={handleSubmit(submitContactUsForm)} className='flex flex-col gap-7'>
        {/* First name and last name div container */}
        <div className='flex flex-col gap-5 lg:flex-row'>
            {/* First Name Div */}
            <div className='flex flex-col gap-2 lg:w-[48%]'>
                <label htmlFor="firstname" className='lable-style'>First Name</label>
                <input
                    type="text"
                    name='firstname'
                    placeholder='Enter first name'
                    id="firstname"
                    className='form-style'
                    {...register("firstname", { required: true })}
                />
                    {
                        errors.firstname && (
                            <span className='-mt-1 text-[12px] text-yellow-100'>Please enter your name.</span>
                        )
                    }
            </div>

            {/* Last Name Div */}
            <div className='flex flex-col gap-2 lg:w-[48%]'>
                <label htmlFor="lastname" className='lable-style'>Last Name</label>
                <input
                    type="text"
                    name='lastname'
                    placeholder='Enter last name'
                    id="lastname"
                    className='form-style'
                    {...register("lastname")}
                />
            </div>
        </div>

        {/* Email Div */}
        <div className='flex flex-col gap-2'>
            <label htmlFor="email" className='lable-style'>Email</label>
            <input
                type="email"
                name='email'
                placeholder='Enter Email ID'
                id="email"
                className='form-style'
                {...register("email", { required: true })}
            />
            {
                errors.email && (
                    <span className='-mt-1 text-[12px] text-yellow-100'>Please enter your email.</span>
                )
            }
        </div>

        {/* Phone Number Div */}
        <div className='flex flex-col gap-2'>
            {/* Phone Number Label */}
            <label htmlFor="phoneNo" className='lable-style'>Phone Number</label>
                
            {/* Container for Country code and phone number fields */}
            <div className='flex gap-5'>
                {/* Country Code Dropdown */}
                <select
                    name="dropdown"
                    id="dropdown"
                    className='form-style w-[81px]'
                    {...register("countryCode", { required: true })}
                >
                    {
                        CountryCode.map((country, index) => (
                            <option key={index} value={country.code}>{country.code} - {country.country}</option>
                        ))
                    }
                </select>

                {/* Phone Number Input */}
                <input
                    type="number"
                    name='phoneNo'
                    placeholder='12345 67890'
                    id="phoneNo"
                    className='form-style w-[calc(100%-90px)]'
                    {
                        ...register("phoneNo", 
                        { 
                            required: { value: true, message: "Phone number is required" },
                            maxLength: { value: 12, message: "Phone number should be 12 digits long" },
                            minLength: { value: 10, message: "Phone number should be 10 digits long" }
                        }
                    )}
                />
            </div>
            {
                errors.phoneNo && (
                <span className='-mt-1 text-[12px] text-yellow-100'>{errors.phoneNo.message}</span>
                )
            }
        </div>

        {/* Message Div */}
        <div className='flex flex-col gap-2'>
            <label htmlFor="message" className='lable-style'>Message</label>
            <textarea
                name='message'
                placeholder='Enter your message here'
                rows="7"
                cols="30"
                id="message"
                className='form-style'
                {...register("message", { required: true })}
            />
            {
                errors.message && (
                    <span className='-mt-1 text-[12px] text-yellow-100'>Please enter your message.</span>
                )
            }
        </div>

        {/* Submit button */}
        <button 
        disabled={loading}
        type='submit' 
        className=
        {`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
           !loading &&
           "transition-all duration-200 hover:scale-95 hover:shadow-none"
         }  disabled:bg-richblack-500 sm:text-[16px] `}>
            Send Message
        </button>
    </form>
  )
}

export default ContactUsForm