import React from 'react'

// Base styles
const base = 'inline-flex w-full font-chivo items-center justify-center rounded-lg text-sm font-medium text-nowrap transition duration-300 ease-in-out'

// Size styles
const sizes = {
  sm: 'h-[32px] gap-1',
  lg: 'h-[38px] gap-2',
}

// Variant styles
const variants = {
  primary: 'bg-[#121212] text-[#f3f3f3] hover:bg-[#292828] hover:text-[#f5ba4c]',
  accent: 'bg-[#f5ba4c] text-[#2b2b26] hover:bg-[#f4ac2d] font-semibold',
  outline: 'border border-[#b4b3ae] bg-transparent text-[#2b2b26] hover:bg-[#e8e6dc] hover:border-transparent',
  // accentPrimary: 'bg-red-800 text-white hover:bg-red-700',
  // accentSecondary: 'bg-red-100 text-red-800 hover:bg-red-200 font-medium',
  ghost: 'bg-transparent text-neutral-900 hover:bg-neutral-200/50',
  success: 'bg-green-100 text-green-700 hover:bg-green-200',
  info: 'text-blue-700 hover:bg-blue-300/30 bg-blue-200/30',
  warning: 'text-yellow-700 hover:bg-yellow-300/30 bg-yellow-200/30',
  danger: 'bg-red-100 text-red-700 hover:bg-red-200',
}

const Button = ({ type, styles = '', variant, size = 'sm', label, disabled, onClick, children }) => {
  const variantStyle = variants[variant] || ''
  const sizeStyle = sizes[size] || ''

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${base} 
        ${variantStyle} 
        ${sizeStyle} 
        ${styles} 
        ${disabled ? 'cursor-not-allowed opacity-20' : 'cursor-pointer'}
      `}
    >
      {label}
      {children}
    </button>
  )
}

export default Button