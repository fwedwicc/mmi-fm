import React from 'react'

const Input = ({ label, placeholder, id, type, name, value, onChange, onInput, onInvalid, styles, required, optional, inputStyles, disabled }) => {
  return (
    <fieldset className={`flex w-full flex-col ${styles}`}>
      <div className='flex items-start'>
        <label htmlFor={id} className={`${label ? '' : 'sr-only'} font-semibold`}>
          {label}
        </label>
        {required && <span className='ml-1 text-red-500'>*</span>}
        {optional && <span className='ml-1 font-normal text-sm text-neutral-400'> (Optional)</span>}
      </div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onInput={onInput}
        onInvalid={onInvalid}
        placeholder={placeholder}
        disabled={disabled}
        className={`flex h-10 w-full rounded-lg border border-[#1F1E1D26] bg-white p-3 text-sm text-[#141413] placeholder:text-[#81807b] focus:outline-none focus:ring-3 focus:ring-[#f4ede2] focus:border-[#d3b8a7] transition duration-300 ease-in-out ${disabled ? 'cursor-not-allowed bg-neutral-100 text-neutral-500' : ''} ${inputStyles}`}
      />
    </fieldset>
  )
}

export default Input