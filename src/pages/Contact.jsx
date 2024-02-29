import React from 'react'
import Footer from '../components/common/Footer'
import ContactForm from '../components/core/ContactPage/ContactForm'
import ContactDetails from '../components/core/ContactPage/ContactDetails'

const Contact = () => {
  return (
    <div>
        {/* Section 1 - Left Text Box and Contact Us Form */}
        <div className='w-11/12 max-w-maxContent mx-auto mt-20 text-white flex flex-col lg:flex-row justify-between gap-10'>
            {/* Left Contact Details */}
            <div className='lg:w-[40%]'>
                <ContactDetails />
            </div>

            {/* Contact Us Form */}
            <div className='lg:w-[60%]'>
                <ContactForm />
            </div>
        </div>

        {/* Section 2 - Review From Other Learners */}

        {/* Section 3 - Footer */}
        <Footer />
    </div>
  )
}

export default Contact