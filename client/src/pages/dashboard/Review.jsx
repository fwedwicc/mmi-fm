import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../../shared/components/ui'
import { Success } from '../../shared/components/custom'
import { XLogo, FacebookLogo, RedditLogo, YouTubeLogo, PublishersLogo } from '../../assets'
import { IconCheck, IconPlus, IconX } from '@tabler/icons-react'
import { dashboardService } from '../../shared/service/dashboardService'
import { useUserStore } from '../../shared/store'
import { showToast } from '../../shared/utils/toast'

const Review = () => {
  const user = useUserStore((state) => state.user)
  const token = useUserStore((state) => state.token)
  const setUser = useUserStore((state) => state.setUser)

  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [review, setReview] = useState(null)

  useEffect(() => {
    const fetchReview = async () => {
      setIsFetching(true)

      try {
        const data = await dashboardService.getReview()
        setReview(data)
      } catch (error) {
        const message =
          error.response?.data?.message ||
          'Failed to load review. Please try again.'

        showToast.error(message)
      } finally {
        setIsFetching(false)
      }
    }

    fetchReview()
  }, [])

  const handleComplete = async () => {
    if (isLoading) {
      return
    }

    setIsLoading(true)

    try {
      await dashboardService.completeOnboarding()

      // Sync the store so RouteGuard sees onboarding as complete
      setUser({ ...user, onboardingCompleted: true }, token)

      setIsComplete(true)
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to complete onboarding. Please try again.'

      showToast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const accountInfoItems = [
    { label: 'Name', value: `${review?.accountInfo?.firstName ?? ''} ${review?.accountInfo?.lastName ?? ''}`.trim() },
    { label: 'Email', value: review?.accountInfo?.email ?? '' },
    { label: 'Position', value: review?.accountInfo?.position ?? '' },
  ]

  const sourceItems = [
    { icon: XLogo, label: 'X (Twitter) Influencers', value: review?.sources?.x ?? 0 },
    { icon: FacebookLogo, label: 'Facebook Influencers', value: review?.sources?.facebook ?? 0 },
    { icon: RedditLogo, label: 'Reddit Influencers', value: review?.sources?.reddit ?? 0 },
    { icon: YouTubeLogo, label: 'YouTube Influencers', value: review?.sources?.youtube ?? 0 },
    { icon: PublishersLogo, label: 'Publisher Influencers', value: review?.sources?.publishers ?? 0 },
  ]

  const keywordItems = [
    { icon: IconCheck, color: 'text-[#0f1e98] bg-[#f0f6ff]', label: 'Main Keywords', value: review?.keywords?.main ?? 0 },
    { icon: IconPlus, color: 'text-[#4ca56a] bg-[#eefeee]', label: 'Additional Keywords', value: review?.keywords?.additional ?? 0 },
    { icon: IconX, color: 'text-[#b21d12] bg-[#fbe9e7]', label: 'Excluded Keywords', value: review?.keywords?.excluded ?? 0 },
  ]

  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-center min-h-screen p-4 pb-0 pl-20"
      >
        <div className='mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-3xl flex-col gap-5'>
          <div className='flex gap-4 justify-between'>
            <div>
              <h3>Review and Complete</h3>
              <p className='text-base'>Make sure everything's good to go</p>
            </div>
            <Button
              type='button'
              variant='primary'
              label={isLoading ? 'COMPLETING...' : 'COMPLETE'}
              onClick={handleComplete}
              disabled={isFetching || isLoading}
              styles='w-full max-w-36'
              size='lg'
            >
            </Button>
          </div>
          <div className='flex-1 flex-col space-y-4'>
            {/* Account Information */}
            <div className='border p-7.5 bg-white border-[#e8e6dc] rounded-2xl'>
              <h4>Account Information</h4>
              <div className='flex items-start gap-10 mt-4'>
                {accountInfoItems.map((item, index) => (
                  <div key={index}>
                    <span className='text-base text-[#73726c]'>{item.label}</span>
                    <p className='text-base font-medium'>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              {/* Connected Social Sources */}
              <div className='border p-7.5 bg-white border-[#e8e6dc] rounded-2xl'>
                <h4>Connected Social Sources</h4>
                <div className='space-y-2 mt-4'>
                  {sourceItems.map((item, index) => (
                    <div key={index} className='flex items-center gap-3'>
                      <div className='flex-center size-9 rounded-full overflow-hidden'>
                        <img src={item.icon} alt={item.label} className='size-full object-cover' />
                      </div>
                      <p className='text-base font-medium'>{item.value} {item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Keywords */}
              <div className='border p-7.5 bg-white border-[#e8e6dc] rounded-2xl'>
                <h4>Keywords</h4>
                <div className='space-y-2 mt-4'>
                  {keywordItems.map((item, index) => (
                    <div key={index} className='flex items-center gap-3'>
                      <div className={`flex-center size-9 rounded-full ${item.color}`}>
                        <item.icon className='stroke-[2.5px] size-6.5' />
                      </div>
                      <p className='text-base font-medium'>{item.value} {item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      <AnimatePresence>
        {isComplete && (
          <div className='fixed inset-0 z-50 bg-white'>
            <Success />
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Review