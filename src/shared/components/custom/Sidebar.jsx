import React, { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { IconUserCog, IconHash, IconSpeakerphone, IconBallpen, IconFileDescription, IconCheck } from '@tabler/icons-react'
import { Logomark, ScoupLogo } from '../../../assets'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation()

  const steps = useMemo(
    () => [
      { label: 'Account', to: '/onboarding/account-info', icon: IconUserCog },
      { label: 'Keywords', to: '/onboarding/keywords', icon: IconHash },
      { label: 'Sources', to: '/onboarding/sources', icon: IconSpeakerphone },
      { label: 'Publishers', to: '/onboarding/publishers', icon: IconBallpen },
      { label: 'Review', to: '/onboarding/review', icon: IconFileDescription },
    ],
    []
  )

  const activeIndex = useMemo(
    () => steps.findIndex((step) => pathname.startsWith(step.to)),
    [pathname, steps]
  )

  const activeOpenClass = 'inline-flex w-auto items-center gap-3 px-2 h-9.5 pr-5 rounded-lg text-sm font-bold transition duration-300 ease-in-out bg-[#F0EEE6] text-[#121212]'
  const activeClosedClass = 'inline-flex w-9.5 items-center gap-3 px-2 h-9.5 pr-5 rounded-lg text-sm font-semibold transition duration-300 ease-in-out bg-[#F0EEE6] text-[#121212]'
  const doneOpenClass = 'inline-flex w-auto items-center gap-3 px-2 h-9.5 pr-5 rounded-lg text-sm font-medium transition duration-300 ease-in-out text-[#121212]'
  const doneClosedClass = 'inline-flex w-9.5 items-center gap-3 px-2 h-9.5 pr-5 rounded-lg text-sm font-medium transition duration-300 ease-in-out text-[#121212]'
  const defaultOpenClass = 'inline-flex w-auto items-center gap-3 px-2 h-9.5 pr-5 rounded-lg text-sm font-medium transition duration-300 ease-in-out hover:bg-[#F0EEE6] text-[#121212]'

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
      <div className='flex flex-col gap-y-1'>
        {steps.map((step, index) => {
          const isActive = index === activeIndex
          const isDone = activeIndex > index
          const StepIcon = step.icon

          const className = isOpen
            ? (isActive ? activeOpenClass : isDone ? doneOpenClass : defaultOpenClass)
            : (isDone ? doneClosedClass : isActive ? activeClosedClass : defaultOpenClass)

          return (
            <Link
              key={step.to}
              to={step.to}
              className={className}
              aria-label={step.label}
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
                    // exit={{ opacity: 0, x: -12, width: 0 }}
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
    </aside>
  )
}

export default Sidebar