import React from 'react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { BiArrowBack } from "react-icons/bi"
import { getPasswordResetToken } from '../services/operations/authAPI'

const ForgotPassword = () => {

    // Email Sent Flag Variable
    // This variable will let us know if we need to show reset password page or Check email page
    const [emailSent, setEmailSent] = useState(false);
    // Fetch email from input field
    const [email, setEmail] = useState("");


    const dispatch = useDispatch();
    const {loading} = useSelector((state) => state.auth)

    const handleOnSubmit = (e) => {
        e.preventDefault();

        // Make API call
        dispatch(getPasswordResetToken(email, setEmailSent));
    }

  return (
    // Main Container for Spinner and Contents
    <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
        {
            // IF loading is true, show spinner, else show contents
            loading ? 
            (<div className="spinner"></div>) 
            : (
                // Content Div
                <div className="max-w-[500px] p-4 lg:p-8">
                    {/* Heading */}
                    <h1 className='text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5'>
                        {/* IF emailSent is true, show Check email page, else show reset password page */}
                        {!emailSent 
                        ? "Reset Your Passowrd" 
                        : "Check your email"}
                    </h1>
                        
                    {/* Descripotion */}
                    <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                        {!emailSent 
                        ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery" 
                        : `We have sent the reset email to ${email}`}
                    </p>

                    {/* Form */}
                    <form onSubmit={handleOnSubmit}>
                        {
                            // Email Field is there only for Reset Password Page
                            !emailSent && (
                                <label>
                                    <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  Email Address <sup className="text-pink-200">*</sup>
                </p>
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter email address"
                                        className="form-style w-full"
                                    />
                                </label>
                            )
                        }

                        {/* Submit Button */}
                        <button type="submit" className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900">
                            {       
                                !emailSent 
                                ? "Sumbit" 
                                : "Resend Email"
                            }
                        </button>
                    </form>

                    {/* Button to send back to Login poage */}
                    <div className='flex items-center justify-between mt-6'>
                        <Link to="/login">
                            <p className="flex items-center gap-x-2 text-richblack-5">
                            <BiArrowBack /> Back To Login
                            </p>
                        </Link>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default ForgotPassword