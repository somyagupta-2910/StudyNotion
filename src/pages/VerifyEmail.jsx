import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, signUp } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";
import OTPInput from "react-otp-input";

// Verify Email while signing up for the first time
const VerifyEmail = () => {
    const {signupData, loading} = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // useEffect when signUp data is not present, we will go back to sign up page
    useEffect(() => {
        if (!signupData) {
            navigate("/signup");
        }
    }, []);

    // State variable for OTP
    const [otp, setOtp] = useState("");

    // Handle Form Submission
    const handleOnSubmit = (e) => {
      e.preventDefault();

      // get signUpData from redux store that was stored when submitting signup form
      const { firstName, lastName, email, password, confirmPassword, accountType } = signupData;

      // API Call for Signup and verifying email once we get the OTP
      dispatch(signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate));
    };
  return (
    <div className='min-h-[calc(100vh-3.5rem)] grid place-items-center'>
        {
            loading
            ? (<div className="spinner"></div>)
            : (
               <div className='max-w-[500px] p-4 lg:p-8'>
                    {/* Heading */}
                    <h1 className="text-3xl font-bold">
                        Verify Email
                    </h1>

                    {/* Description */}
                    <p className="text-lg">
                        A verification code has been sent to you. Enter the code below
                    </p>

                    {/* Button */}
                    <form onSubmit={handleOnSubmit}>
                    {/* OTP Input Field */}
                        <OTPInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderInput={(props) => (
                        <input
                        {...props}
                        placeholder="-"
                        style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                        }}
                        className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                        />
                    )}
                    containerStyle={{
                        justifyContent: "space-between",
                        gap: "0 6px",
                    }}></OTPInput>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900" >
                        Verify OTP
                    </button>
                    </form>

                    <div className="mt-6 flex items-center justify-between">
                        {/* Back Button for Signup Page */}
                        <Link to="/signup">
                            <p className="text-richblack-5 flex items-center gap-x-2">
                                <BiArrowBack /> Back To Signup
                            </p>
                        </Link>
                        {/* Resend OTP Button */}
                        <button
                        className="flex items-center text-blue-100 gap-x-2"
                        onClick={() => dispatch(sendOtp(signupData.email))}
                        >
                            <RxCountdownTimer />
                            Resend it
                        </button>
                    </div>
               </div>
            )
        }
    </div>
  )
}

export default VerifyEmail