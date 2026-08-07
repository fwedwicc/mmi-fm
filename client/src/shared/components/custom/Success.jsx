import React, { useState } from 'react'
import { Logomark } from '../../../assets'
import { motion } from 'framer-motion'
import { Button, Input } from '../ui'

const Success = () => {

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex-center min-h-screen bg-[#faf9f5] p-4 pl-20"
    >
      <div className='flex-col flex-center gap-2 mb-4'>
        <img src={Logomark} alt='Logo' className='w-11 h-auto mb-4.5' />
        <h1>You're all set!</h1>
        <p className='text-base leading-snug text-center'>Your account is ready. Start creating engaging newsletters. <br /> Connect with your audience and grow your brand! </p>
        <Button
          type='submit'
          variant='primary'
          label='GO TO NEWS LETTER DASHBOARD'
          // label={isLoading ? 'Logging in…' : 'Log me in'}
          // disabled={isLoading}
          styles='mt-5 !w-auto px-3.5'
        >
          {/* {isLoading && <Spinner size='18' />} */}
        </Button>
      </div>
    </motion.section>
  )
}

export default Success