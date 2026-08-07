import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
// import { HiOutlineX } from "react-icons/hi"

const Modal = ({ isOpen, onClose, size, title, children, onCloseHidden = false }) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden")
      document.documentElement.classList.add("overflow-hidden")
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      document.body.classList.remove("overflow-hidden")
      document.documentElement.classList.remove("overflow-hidden")
      setIsAnimating(false)
    }
    return () => {
      document.body.classList.remove("overflow-hidden")
      document.documentElement.classList.remove("overflow-hidden")
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      className={`fixed inset-0 flex-center md:p-6 p-4 bg-neutral-900/50 z-999999! overflow-y-auto transition-opacity duration-300 ease-in-out ${isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
      data-lenis-prevent
    >
      <div
        className={`relative bg-[#f5f4ed] rounded-2xl flex flex-col w-full my-auto transition-all duration-300 ease-in-out ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="md:p-4 p-3">
          {/* Modal Header */}
          <div className="flex-between gap-2 pb-1">
            <h3 className="ml-2 my-2 font-extrabold">{title}</h3>
            {!onCloseHidden && (
              <button
                className='border p-2 rounded-xl'
                onClick={onClose}
              >
                {/* <HiOutlineX /> */}
              </button>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Modal