import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Input } from '../../shared/components/ui'
import { useNavigate } from 'react-router-dom'
import { dashboardService } from '../../shared/service/dashboardService'
import { useDashboardStore } from '../../shared/store'
import { showToast } from '../../shared/utils/toast'

const AccountInformation = () => {

  const navigate = useNavigate()

  const completeStep = useDashboardStore(
    (state) => state.completeStep
  )

  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const isFormValid =
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.jobTitle.trim() !== ''

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isFormValid || isLoading) {
      return
    }

    setIsLoading(true)

    try {
      await dashboardService.updateAccountInformation({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        jobTitle: formData.jobTitle.trim()
      })

      // Mark account information step as completed
      completeStep('accountInfo')

      showToast.success(
        'Account information saved successfully!'
      )

      // Move to next onboarding step
      navigate('/onboarding/keywords')

    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to save account information. Please try again.'

      showToast.error(message)

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex-center min-h-screen p-4 pl-20"
    >
      <div className='flex-col flex-center w-full gap-2'>
        {/* Sign up form */}
        <form onSubmit={handleSubmit} className='w-full max-w-124 p-6.75 space-y-6 bg-[#FAF9F5] border border-[#1F1E1D]/15 shadow-[0px_4px_4px_0px_#00000003,0px_16px_32px_0px_#00000003,0px_2px_64px_0px_#00000005,0px_4px_32px_0px_#00000005] rounded-3xl'>
          {/* Header */}
          <div className='flex-col space-y-0.5'>
            <h3>Account Information</h3>
            <p className='text-base leading-none'>Create your account to get started with your newsletter journey</p>
          </div>
          <div className='space-y-4'>
            <Input
              label="First Name"
              id="first-name"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
            />
            <Input
              label="Last Name"
              id="last-name"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
            />
            <Input
              label="Job Title"
              id="job-title"
              name="jobTitle"
              type="text"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="Enter your job title"
              required
            />
          </div>
          <Button
            type='submit'
            variant='primary'
            label='NEXT'
            label={isLoading ? 'SAVING...' : 'NEXT'}
            disabled={!isFormValid || isLoading}
            styles='w-full'
          >
            {/* {isLoading && <Spinner size='18' />} */}
          </Button>
        </form>
      </div>
    </motion.section>
  )
}

export default AccountInformation