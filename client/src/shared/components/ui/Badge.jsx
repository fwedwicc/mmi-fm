import React from 'react'

// Base styles
const base = 'inline-flex items-center gap-1 rounded-full pl-2 pr-0.5 h-5 text-xs font-medium uppercase tracking-[-0.2px] font-chivo'

// Variant styles
const variants = {
  main: 'bg-[#f0f6ff] text-[#0f1e98]',
  additional: 'bg-[#eefeee] text-[#3d9751]',
  excluded: 'bg-[#fbe9e7] text-[#bf423d]',
}

const Badge = ({ styles = '', variant, size, label, children }) => {
  const variantStyle = variants[variant] || ''

  return (
    <div
      className={`
        ${base} 
        ${variantStyle}
        ${styles}
      `}
    >
      {label}
      {children}
    </div>
  )
}

export default Badge