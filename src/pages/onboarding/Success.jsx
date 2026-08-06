import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Input } from '../../shared/components/ui'

const Success = () => {

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex-center min-h-screen p-4 pl-20"
    >
      Success
    </motion.section>
  )
}

export default Success