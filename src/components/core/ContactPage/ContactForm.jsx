import React from 'react'
import ContactUsForm from './ContactUsForm'

const ContactForm = () => {
  return (
    // Container for the Form Div
    <div className='border border-richblack-600 text-richblack-300 rounded-xl p-7 lg:p-14 flex flex-col gap-3'>
        {/* Heading */}
        <h1 className='text-4xl leading-10 font-semibold text-richblack-5'>
            Got an Idea? We&apos;ve got the skills. Let&apos;s team up
        </h1>

        {/* Paragraph */}
        <p className='font-medium'>
            Tell us more about yourself and what you&apos;re got in mind.
        </p>

        {/* Form */}
        <ContactUsForm />
    </div>
  )
}

export default ContactForm