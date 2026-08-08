import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Input } from '../../shared/components/ui'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../shared/service/authService'
import { dashboardService } from '../../shared/service/dashboardService'
import { useDashboardStore, useUserStore } from '../../shared/store'
import { showToast } from '../../shared/utils/toast'

const emptyFormData = { firstName: '', lastName: '', jobTitle: '' }

const AccountInformation = ({ mode = 'onboarding' }) => {
  const isDashboard = mode === 'dashboard'

  const navigate = useNavigate()

  const completeStep = useDashboardStore(
    (state) => state.completeStep
  )

  const user = useUserStore((state) => state.user)
  const token = useUserStore((state) => state.token)
  const setUser = useUserStore((state) => state.setUser)

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(isDashboard)

  const [formData, setFormData] = useState(emptyFormData)
  const [initialFormData, setInitialFormData] = useState(emptyFormData)

  useEffect(() => {
    if (!isDashboard) {
      return
    }

    const fetchAccountInfo = async () => {
      setIsFetching(true)

      try {
        const data = await authService.getMe()
        const me = data?.user

        const loaded = {
          firstName: me?.firstName ?? '',
          lastName: me?.lastName ?? '',
          jobTitle: me?.jobTitle ?? '',
        }

        setFormData(loaded)
        setInitialFormData(loaded)
      } catch (error) {
        const message =
          error.response?.data?.message ||
          'Failed to load account information. Please try again.'

        showToast.error(message)
      } finally {
        setIsFetching(false)
      }
    }

    fetchAccountInfo()
  }, [isDashboard])

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

  const isDirty =
    formData.firstName !== initialFormData.firstName ||
    formData.lastName !== initialFormData.lastName ||
    formData.jobTitle !== initialFormData.jobTitle

  const isSaveDisabled =
    !isFormValid ||
    isLoading ||
    isFetching ||
    (isDashboard && !isDirty)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSaveDisabled) {
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        jobTitle: formData.jobTitle.trim()
      }

      await dashboardService.updateAccountInformation(payload)

      if (isDashboard) {
        // Keep the store in sync (sidebar profile popup reads from it)
        setUser({ ...user, ...payload }, token)

        // Reset the "dirty" baseline so Save disables again until next edit
        setFormData(payload)
        setInitialFormData(payload)

        showToast.success('Account information saved successfully!')
      } else {
        // Mark account information step as completed
        completeStep('accountInfo')

        showToast.success('Account information saved successfully!')

        // Move to next onboarding step
        navigate('/onboarding/keywords')
      }

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
            label={isLoading ? 'SAVING...' : isDashboard ? 'SAVE' : 'NEXT'}
            disabled={isSaveDisabled}
            styles='w-full'
          >
          </Button>
        </form>
      </div>
    </motion.section>
  )
}

export default AccountInformation