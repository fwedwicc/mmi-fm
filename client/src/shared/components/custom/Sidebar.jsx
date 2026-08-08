import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useUserStore, useDashboardStore } from '../../store'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  IconUserCog,
  IconHash,
  IconSpeakerphone,
  IconBallpen,
  IconFileDescription,
  IconCheck,
  IconInbox,
  IconLogout,
  IconChevronRight,
} from '@tabler/icons-react'
import { Logomark, ScoupLogo } from '../../../assets'

const onboardingSteps = [
  { label: 'Account', to: '/onboarding/account-info', icon: IconUserCog },
  { label: 'Keywords', to: '/onboarding/keywords', icon: IconHash },
  { label: 'Sources', to: '/onboarding/sources', icon: IconSpeakerphone },
  { label: 'Publishers', to: '/onboarding/publishers', icon: IconBallpen },
  { label: 'Review', to: '/onboarding/review', icon: IconFileDescription },
]

const dashboardNav = [
  { label: 'Inbox', to: '/dashboard', icon: IconInbox },
  { label: 'Sources', to: '/dashboard/sources', icon: IconSpeakerphone },
  { label: 'Publishers', to: '/dashboard/publishers', icon: IconBallpen },
]

const Sidebar = ({ mode = 'onboarding' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const profileRef = useRef(null)

  const user = useUserStore((state) => state.user)
  const logout = useUserStore((state) => state.logout)

  const activeOpenClass = 'inline-flex w-auto items-center gap-3 px-2 h-9.5 pr-5 rounded-lg text-sm font-bold transition duration-300 ease-in-out bg-[#F0EEE6] text-[#121212]'
  const activeClosedClass = 'inline-flex w-9.5 items-center gap-3 px-2 h-9.5 pr-5 rounded-lg text-sm font-semibold transition duration-300 ease-in-out bg-[#F0EEE6] text-[#121212]'
  const doneOpenClass = 'inline-flex w-auto items-center gap-3 px-2 h-9.5 pr-5 rounded-lg text-sm font-medium transition duration-300 ease-in-out text-[#121212]'
  const doneClosedClass = 'inline-flex w-9.5 items-center gap-3 px-2 h-9.5 pr-5 rounded-lg text-sm font-medium transition duration-300 ease-in-out text-[#121212]'
  const defaultOpenClass = 'inline-flex w-auto items-center gap-3 px-2 h-9.5 pr-5 rounded-lg text-sm font-medium transition duration-300 ease-in-out hover:bg-[#F0EEE6] text-[#121212]'

  const activeIndex = useMemo(
    () => onboardingSteps.findIndex((step) => pathname.startsWith(step.to)),
    [pathname]
  )

  const resetOnboardingProgress = useDashboardStore(
    (state) => state.resetOnboardingProgress
  )

  useEffect(() => {
    if (!isProfileOpen) {
      return
    }

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProfileOpen])

  const handleLogout = () => {
    logout()
    resetOnboardingProgress()
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={`fixed flex flex-col items-start left-0 top-0 p-3 h-full bg-[#faf9f5] ${isOpen ? 'w-auto border border-[#1F1E1D]/5' : 'w-15 border border-[#faf9f5]/5'} transition-all duration-300 ease-in-out`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className='relative h-7 w-auto mb-4.5'>
        <AnimatePresence mode='wait' initial={false}>
          {isOpen ? (
            <motion.img
              key='logo-open'
              src={ScoupLogo}
              alt='Logo'
              className='h-7 w-auto'
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.1, ease: 'easeInOut' }}
            />
          ) : (
            <motion.img
              key='logo-closed'
              src={Logomark}
              alt='Logo'
              className='h-7 w-auto'
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.1, ease: 'easeInOut' }}
            />
          )}
        </AnimatePresence>
      </div>

      {mode === 'onboarding' ? (
        <div className='flex flex-col gap-y-1'>
          {onboardingSteps.map((step, index) => {
            const isActive = index === activeIndex
            const isDone = activeIndex > index
            const isFuture = index > activeIndex

            const StepIcon = step.icon

            const className = isOpen
              ? (
                isActive
                  ? activeOpenClass
                  : isDone
                    ? doneOpenClass
                    : defaultOpenClass
              )
              : (
                isDone
                  ? doneClosedClass
                  : isActive
                    ? activeClosedClass
                    : defaultOpenClass
              )

            return (
              <Link
                key={step.to}
                to={isFuture ? '#' : step.to}
                onClick={(e) => {
                  if (isFuture) {
                    e.preventDefault()
                  }
                }}
                className={className}
                aria-label={step.label}
                aria-disabled={isFuture}
              >
                {isDone ? (
                  <IconCheck className='size-5.5 shrink-0 stroke-[1.5px] text-[#14AE5C]' />
                ) : (
                  <StepIcon className='size-5.5 shrink-0 stroke-[1.5px]' />
                )}

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.span
                      key='label'
                      className='overflow-hidden whitespace-nowrap'
                      initial={{ opacity: 0, x: -10, width: 0 }}
                      animate={{ opacity: 1, x: 0, width: 'auto' }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      {step.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </div>
      ) : (
        <>
          <div className='flex flex-col gap-y-1'>
            {dashboardNav.map((item) => {
              const isActive = item.to === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.to)

              const ItemIcon = item.icon

              const className = isOpen
                ? (isActive ? activeOpenClass : defaultOpenClass)
                : (isActive ? activeClosedClass : defaultOpenClass)

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={className}
                  aria-label={item.label}
                >
                  <ItemIcon className='size-5.5 shrink-0 stroke-[1.5px]' />

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.span
                        key='label'
                        className='overflow-hidden whitespace-nowrap'
                        initial={{ opacity: 0, x: -10, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: 'auto' }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )
            })}
          </div>

          {/* Account profile — pinned to bottom */}
          <div ref={profileRef} className='relative mt-auto w-full'>
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15, ease: 'easeInOut' }}
                  className='absolute bottom-full left-0 mb-2 w-56 rounded-xl border border-[#1F1E1D]/10 bg-white p-3 shadow-[0px_16px_32px_0px_#00000010]'
                >
                  <p className='truncate text-sm font-semibold text-[#121212]'>
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className='truncate text-xs text-[#73726C]'>
                    {user?.email}
                  </p>
                  <Link
                    to='/dashboard/account-information'
                    onClick={() => setIsProfileOpen(false)}
                    className='mt-3 flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-[#121212] transition hover:bg-[#F0EEE6]'
                  >
                    <IconUserCog className='size-4.5 stroke-[1.5px]' />
                    Account Information
                  </Link>
                  <button
                    type='button'
                    onClick={handleLogout}
                    className='mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm font-medium text-[#B3261E] transition hover:bg-[#fdf1f0]'
                  >
                    <IconLogout className='size-4.5 stroke-[1.5px]' />
                    Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type='button'
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className={isOpen ? activeOpenClass.replace('bg-[#F0EEE6]', '').concat(' hover:bg-[#F0EEE6] w-full justify-between') : defaultOpenClass.concat(' w-full')}
            >
              <span className='flex items-center gap-3'>
                <span className='flex-center size-5.5 shrink-0 rounded-full bg-[#F0EEE6] text-xs font-bold'>
                  {user?.firstName?.[0]?.toUpperCase() ?? '?'}
                </span>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.span
                      key='label'
                      className='overflow-hidden whitespace-nowrap'
                      initial={{ opacity: 0, x: -10, width: 0 }}
                      animate={{ opacity: 1, x: 0, width: 'auto' }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      {user?.firstName}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              {isOpen && <IconChevronRight className='size-4 stroke-[1.5px]' />}
            </button>
          </div>
        </>
      )}
    </aside>
  )
}

export default Sidebar