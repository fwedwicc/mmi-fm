import React, { useEffect, useRef, useState } from 'react'
import { IconCloudUpload, IconCheck, IconX, IconFileAlert } from '@tabler/icons-react'
import { Button, Modal } from '../ui'
import { downloadSourcesCsvTemplate, parseSourcesCsvFile } from '../../utils/csvSources'
import { showToast } from '../../utils/toast'

const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  return `${(bytes / 1024).toFixed(2)} KB`
}

const ImportSourcesModal = ({ isOpen, onClose, onImport }) => {
  const inputRef = useRef(null)
  const progressIntervalRef = useRef(null)
  const finalizeTimeoutRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [parsedRows, setParsedRows] = useState([])
  const [error, setError] = useState('')

  const clearAsyncHandles = () => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    if (finalizeTimeoutRef.current) {
      window.clearTimeout(finalizeTimeoutRef.current)
      finalizeTimeoutRef.current = null
    }
  }

  const resetLocalState = () => {
    clearAsyncHandles()
    setIsLoading(false)
    setProgress(0)
    setSelectedFile(null)
    setParsedRows([])
    setError('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  useEffect(() => {
    if (isOpen) {
      resetLocalState()
    }
  }, [isOpen])

  useEffect(() => () => {
    clearAsyncHandles()
  }, [])

  const closeModal = () => {
    if (isLoading) {
      return
    }

    resetLocalState()
    onClose()
  }

  const triggerFilePicker = () => {
    if (!isLoading) {
      inputRef.current?.click()
    }
  }

  const handleImport = () => {
    onImport(parsedRows)
    showToast.success('Sources imported successfully!')
    closeModal()
  }

  const handleSelectFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const isCsvFile = file.name.toLowerCase().endsWith('.csv')
    if (!isCsvFile) {
      setError('Please upload a CSV file for now.')
      return
    }

    setError('')
    setSelectedFile(file)
    setParsedRows([])
    setIsLoading(true)
    setProgress(12)

    let fakeProgress = 12
    progressIntervalRef.current = window.setInterval(() => {
      fakeProgress = Math.min(fakeProgress + 9, 86)
      setProgress(fakeProgress)
    }, 120)

    try {
      const rows = await parseSourcesCsvFile(file)
      const filteredRows = rows.filter((row) =>
        row.x.trim() || row.facebook.trim() || row.reddit.trim() || row.youtube.trim()
      )

      clearAsyncHandles()
      setProgress(100)

      finalizeTimeoutRef.current = window.setTimeout(() => {
        setParsedRows(filteredRows)
        setIsLoading(false)
        finalizeTimeoutRef.current = null
      }, 220)
    } catch (parseError) {
      clearAsyncHandles()
      setIsLoading(false)
      setProgress(0)
      setParsedRows([])
      setError(parseError?.message || 'Unable to parse CSV file.')
    }
  }

  const canImport = parsedRows.length > 0 && !isLoading
  const isRejected = !isLoading && !!selectedFile && !error && parsedRows.length === 0

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size='max-w-120'
      title='Import CSV/Excel File'
      onCloseHidden
    >
      <div className='px-2 pb-2'>
        <div
          role='button'
          tabIndex={0}
          onClick={triggerFilePicker}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              triggerFilePicker()
            }
          }}
          className='mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-[#dedddd] bg-white px-4 pt-9 pb-8 text-center transition duration-300 hover:border-[#CFC8B9]'
        >
          <IconCloudUpload className='size-11 stroke-[1.2px] text-[#33312D]' />
          <p className='mt-3 text-base font-bold leading-none text-[#2B2923]'>
            Click to import
            <span className='ml-1 font-normal text-[#76726A]'>or drag and drop</span>
          </p>
          <p className='mt-1 text-sm text-[#77736B]'>
            Excel (.xls, .xlsx) or CSV (.csv) files (max. 10MB)
          </p>
          <input
            ref={inputRef}
            type='file'
            accept='.csv,.xls,.xlsx'
            onChange={handleSelectFile}
            className='hidden'
          />
        </div>
        {selectedFile && (
          <div
            className={`mt-4 rounded-lg border px-4 py-4 ${isLoading
              ? 'border-[#93cafe] bg-[#f1f8ff]'
              : isRejected
                ? 'border-[#f3b4ad] bg-[#fdf1f0]'
                : 'border-[#88e7a6] bg-[#effdf3]'
              }`}
          >
            <div className='flex items-center gap-3'>
              <div
                className={`flex-center size-8 rounded-full ${isLoading
                  ? 'bg-[#70a6f9]'
                  : isRejected
                    ? 'bg-[#D8473A]'
                    : 'bg-[#1FB56A]'
                  }`}
              >
                {isLoading ? (
                  <IconCloudUpload className='size-5.5 stroke-[1.8px] text-white' />
                ) : isRejected ? (
                  <IconFileAlert className='size-5.5 stroke-[1.8px] text-white' />
                ) : (
                  <IconCheck className='size-5.5 stroke-[1.8px] text-white' />
                )}
              </div>
              <div className='min-w-0 flex-1'>
                <p
                  className={`truncate text-base font-normal leading-none ${isLoading
                    ? 'text-[#5084f5]'
                    : isRejected
                      ? 'text-[#B3261E]'
                      : 'text-[#1f532d]'
                    }`}
                >
                  {selectedFile.name}
                </p>
                <p className='mt-1.5 space-x-2 text-xs leading-none text-[#8A8880]'>
                  <span>{formatFileSize(selectedFile.size)}</span>
                  {(isLoading || isRejected) && <span>•</span>}
                  {isLoading && <span className='text-[#5084f5]'>{progress}%</span>}
                  {isRejected && <span className='text-[#D8473A]'>Not accepted</span>}
                </p>
                {isLoading && (
                  <div className='mt-1 h-1 overflow-hidden rounded-full bg-[#e9eaeb]'>
                    <div
                      className='h-full rounded-full bg-[#6799e5] transition-all duration-200'
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
              {!isLoading && (
                <button
                  type='button'
                  onClick={resetLocalState}
                  className='rounded-md p-1 text-[#8A8880] transition hover:bg-black/5 hover:text-[#4A4740]'
                  aria-label='Remove file'
                >
                  <IconX className='size-4' />
                </button>
              )}
            </div>
          </div>
        )}
        <div className='mt-3.5 space-y-1 text-xs'>
          <button
            type='button'
            onClick={downloadSourcesCsvTemplate}
            className='block text-left font-semibold text-[#3A79E3] underline underline-offset-2'
          >
            • Download a sample .xls template
          </button>
          <button
            type='button'
            onClick={downloadSourcesCsvTemplate}
            className='block text-left font-semibold text-[#3A79E3] underline underline-offset-2'
          >
            • Download a sample .csv template
          </button>
        </div>
        {error && <p className='mt-3 text-sm text-[#D8473A]'>{error}</p>}
        <div className='mt-4 flex items-center justify-end gap-2 pt-3'>
          <Button
            type='button'
            variant='outline'
            label='CANCEL'
            onClick={closeModal}
            disabled={isLoading}
            styles='!w-auto px-3 !h-7.5 text-xs font-semibold'
          />
          <Button
            type='button'
            variant='primary'
            label='IMPORT'
            disabled={!canImport}
            onClick={handleImport}
            styles='!w-auto px-3 !h-7.5 text-xs font-semibold'
          />
        </div>
      </div>
    </Modal>
  )
}

export default ImportSourcesModal
