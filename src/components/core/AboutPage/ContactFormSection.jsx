import React from 'react'
import ContactUsForm from '../ContactPage/ContactUsForm'

const ContactFormSection = () => {
  return (
    // Main Container
    <div className='mx-auto'>
        {/* Heading */}
        <h1 className="text-center text-4xl font-semibold">
            Get in Touch
        </h1>
        {/* Paragraph */}
        <p className="text-center text-richblack-300 mt-3">
            We&apos;d love to here for you, Please fill out this form.
        </p>

        {/* Form Container*/}
        <div className='mx-auto mt-12'>
            <ContactUsForm />
        </div>
    </div>
  )
}

export default ContactFormSection