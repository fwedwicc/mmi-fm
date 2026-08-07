import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button, Badge } from '../../shared/components/ui'
import { showToast } from '../../shared/utils/toast'
import { IconX } from '@tabler/icons-react'
import { dashboardService } from '../../shared/service/dashboardService'
import { useDashboardStore } from '../../shared/store'

const initialKeywords = {
  main: [],
  additional: [],
  excluded: [],
}

const initialInputs = {
  main: '',
  additional: '',
  excluded: '',
}

const sections = [
  {
    key: 'main',
    title: 'Main Keywords',
    placeholder: 'Add main keywords here and press enter',
    variant: 'main',
  },
  {
    key: 'additional',
    title: 'Additional Keywords',
    placeholder: 'Add additional keywords here and press enter',
    variant: 'additional',
  },
  {
    key: 'excluded',
    title: 'Excluded Keywords',
    placeholder: 'Add excluded keywords here and press enter',
    variant: 'excluded',
  },
]

const sectionTitleByKey = sections.reduce((acc, section) => {
  acc[section.key] = section.title
  return acc
}, {})

const normalizeKeyword = (keyword) => keyword.trim().replace(/\s+/g, ' ')

const splitKeywordInput = (value) =>
  value
    .split(/[,\n;]/)
    .map(normalizeKeyword)
    .filter(Boolean)

const Keywords = () => {
  const navigate = useNavigate()
  const completeStep = useDashboardStore(
    (state) => state.completeStep
  )

  const [keywords, setKeywords] = useState(initialKeywords)
  const [inputs, setInputs] = useState(initialInputs)
  const [isLoading, setIsLoading] = useState(false)

  const totalKeywords = useMemo(
    () =>
      Object.values(keywords).reduce(
        (count, items) => count + items.length,
        0
      ),
    [keywords]
  )

  const findKeywordSection = (keyword) => {
    const normalized = keyword.toLowerCase()

    return sections.find((section) =>
      keywords[section.key].some(
        (existing) =>
          existing.toLowerCase() === normalized
      )
    )
  }

  const addKeywords = (sectionKey, rawValue) => {
    const nextKeywords = splitKeywordInput(rawValue)

    if (!nextKeywords.length) {
      return false
    }

    const seen = new Set()
    const filtered = []

    for (const keyword of nextKeywords) {
      const normalized = keyword.toLowerCase()

      if (seen.has(normalized)) {
        continue
      }

      const duplicateSection = findKeywordSection(keyword)

      if (duplicateSection) {
        const locationLabel =
          duplicateSection.key === sectionKey
            ? 'this section'
            : duplicateSection.title

        showToast.warning(
          `"${keyword}" is already added in ${locationLabel}`
        )

        continue
      }

      seen.add(normalized)
      filtered.push(keyword)
    }

    if (filtered.length) {
      setKeywords((current) => ({
        ...current,
        [sectionKey]: [
          ...current[sectionKey],
          ...filtered,
        ],
      }))
    }

    return true
  }

  const clearInput = (sectionKey) => {
    setInputs((current) => ({
      ...current,
      [sectionKey]: '',
    }))
  }

  const handleKeyDown = (event, sectionKey) => {
    if (event.key !== 'Enter' && event.key !== ',') {
      return
    }

    event.preventDefault()

    const added = addKeywords(
      sectionKey,
      inputs[sectionKey]
    )

    if (added) {
      clearInput(sectionKey)
    }
  }

  const handleBlur = (sectionKey) => {
    const added = addKeywords(
      sectionKey,
      inputs[sectionKey]
    )

    if (added) {
      clearInput(sectionKey)
    }
  }

  const removeKeyword = (
    sectionKey,
    keywordToRemove
  ) => {
    setKeywords((current) => ({
      ...current,
      [sectionKey]: current[sectionKey].filter(
        (keyword) => keyword !== keywordToRemove
      ),
    }))
  }

  const isCompleteEnabled =
    keywords.main.length > 0 &&
    keywords.additional.length > 0 &&
    keywords.excluded.length > 0

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isCompleteEnabled || isLoading) {
      return
    }

    setIsLoading(true)

    try {
      await dashboardService.saveKeywords({
        main: keywords.main,
        additional: keywords.additional,
        excluded: keywords.excluded,
      })

      // Mark keywords step as completed
      completeStep('keywords')

      showToast.success(
        'Keywords saved successfully!'
      )

      // Move to next onboarding step
      navigate('/onboarding/sources')

    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to save keywords. Please try again.'

      showToast.error(message)

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex-center min-h-screen p-4 pb-0 pl-20"
    >
      <form onSubmit={handleSubmit} className='mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-3xl flex-col gap-5'>
        <div className='flex gap-4 justify-between'>
          <div>
            <h3>Keywords</h3>
            <p className='text-base'>Setup the keywords needed for the content</p>
          </div>
          <Button
            type='submit'
            variant='primary'
            label='COMPLETE'
            label={isLoading ? 'SAVING…' : 'COMPLETE'}
            disabled={!isCompleteEnabled || isLoading}
            styles='w-full max-w-36'
            size='lg'
          >
            {/* {isLoading && <Spinner size='18' />} */}
          </Button>
        </div>
        <div className='rounded-3xl bg-white p-6 flex-1'>
          <p className='leading-none'>Keywords Preview</p>
          <div className='space-y-8 p-10 pt-4'>
            {sections.map((section) => {
              const sectionKeywords = keywords[section.key]
              const sectionInput = inputs[section.key]

              return (
                <div key={section.key} className='space-y-0.5'>
                  <h4 className={`text-sm font-bold text-[#2B2A28] pt-6`}>{section.title}</h4>
                  {/* Keywords */}
                  <div className={`flex flex-wrap gap-1.75 ${sectionKeywords.length > 0 ? 'py-1.75' : ''}`}>
                    <AnimatePresence initial={false}>
                      {sectionKeywords.map((keyword) => (
                        <motion.div
                          key={`${section.key}-${keyword}`}
                          layout
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                        >
                          <Badge variant={section.variant}>
                            {keyword}
                            <button
                              type='button'
                              onClick={() => removeKeyword(section.key, keyword)}
                              className='inline-flex size-4 items-center justify-center rounded-full bg-neutral-600/5 transition hover:bg-neutral-600/10'
                              aria-label={`Remove ${keyword}`}
                            >
                              <IconX className='size-3' stroke={2} />
                            </button>
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  {/* Input keyword */}
                  <input
                    type='text'
                    value={sectionInput}
                    onChange={(event) =>
                      setInputs((current) => ({
                        ...current,
                        [section.key]: event.target.value,
                      }))
                    }
                    onKeyDown={(event) => handleKeyDown(event, section.key)}
                    onBlur={() => handleBlur(section.key)}
                    placeholder={section.placeholder}
                    className='w-full border-0 bg-transparent text-xs font-medium text-[#2B2A28] placeholder:font-normal placeholder:text-[#A7A39A] font-chivo focus:outline-none'
                  />
                </div>
              )
            })}
          </div>
        </div>
      </form>
    </motion.section>
  )
}

export default Keywords