import toast from 'react-hot-toast'

const toastStyles = {
  style: {
    border: "0px solid transparent",
    boxShadow: "0 20px 25px -5px rgba(23, 23, 23, 0.1), 0 8px 10px -6px rgba(23, 23, 23, 0.1)",
    backgroundColor: '#171717',
    borderRadius: "12px",
    padding: '7px 7px 7px 12px',
    fontSize: '0.875rem',
  },
}

export const showToast = {
  error: (message) => {
    toast.error(message, {
      ...toastStyles,
      style: {
        ...toastStyles.style,
        color: '#f87171',
      },
      iconTheme: {
        primary: '#f87171',
        secondary: '#171717',
      },
    })
  },

  success: (message) => {
    toast.success(message, {
      ...toastStyles,
      style: {
        ...toastStyles.style,
        color: '#4ade80',
      },
      iconTheme: {
        primary: '#4ade80',
        secondary: '#171717',
      },
    })
  },

  warning: (message) => {
    toast(message, {
      ...toastStyles,
      style: {
        ...toastStyles.style,
        color: '#f59e0b',
      },
      iconTheme: {
        primary: '#f59e0b',
        secondary: '#171717',
      },
    })
  },

  loading: (message) => {
    return toast.loading(message, {
      ...toastStyles,
      style: {
        ...toastStyles.style,
        color: '#60a5fa',
      },
      iconTheme: {
        primary: '#60a5fa',
        secondary: '#171717',
      },
    })
  },

  promise: (promise, messages) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Error occurred',
      },
      {
        ...toastStyles,
        success: {
          ...toastStyles,
          style: {
            ...toastStyles.style,
            color: '#22c55e',
          },
          iconTheme: {
            primary: '#22c55e',
            secondary: '#171717',
          },
        },
        error: {
          ...toastStyles,
          style: {
            ...toastStyles.style,
            color: '#f87171',
          },
          iconTheme: {
            primary: '#f87171',
            secondary: '#171717',
          },
        },
        loading: {
          ...toastStyles,
          style: {
            ...toastStyles.style,
            color: '#60a5fa',
          },
          iconTheme: {
            primary: '#60a5fa',
            secondary: '#171717',
          },
        },
      }
    )
  },
}