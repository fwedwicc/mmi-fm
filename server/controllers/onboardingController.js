import User from '../models/userModel.js'
import Onboarding from '../models/onboardingModel.js'

export const updateAccountInformation = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      jobTitle
    } = req.body

    // Validate fields
    if (!firstName || !lastName || !jobTitle) {
      return res.status(400).json({
        message: 'All fields are required'
      })
    }

    // Find authenticated user
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    // Update account information
    user.firstName = firstName
    user.lastName = lastName
    user.jobTitle = jobTitle

    await user.save()

    res.status(200).json({
      message: 'Account information updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        jobTitle: user.jobTitle,
        onboardingCompleted: user.onboardingCompleted
      }
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const saveKeywords = async (req, res) => {
  try {
    const userId = req.user.id

    const {
      main = [],
      additional = [],
      excluded = []
    } = req.body

    // Make sure all values are arrays
    if (
      !Array.isArray(main) ||
      !Array.isArray(additional) ||
      !Array.isArray(excluded)
    ) {
      return res.status(400).json({
        message: 'Keywords must be arrays'
      })
    }

    // Combine all keywords
    const allKeywords = [
      ...main,
      ...additional,
      ...excluded
    ]

    // Normalize keywords for duplicate checking
    const normalizedKeywords = allKeywords.map(keyword =>
      keyword.trim().toLowerCase()
    )

    // Check for duplicates
    const uniqueKeywords = new Set(normalizedKeywords)

    if (uniqueKeywords.size !== normalizedKeywords.length) {
      return res.status(400).json({
        message: 'Keywords cannot be repeated'
      })
    }

    // Clean the keywords before saving
    const cleanedMain = main.map(keyword => keyword.trim())
    const cleanedAdditional = additional.map(keyword => keyword.trim())
    const cleanedExcluded = excluded.map(keyword => keyword.trim())

    const onboarding = await Onboarding.findOneAndUpdate(
      { userId },
      {
        $set: {
          keywords: {
            main: cleanedMain,
            additional: cleanedAdditional,
            excluded: cleanedExcluded
          }
        }
      },
      {
        new: true,
        upsert: true
      }
    )

    res.status(200).json({
      message: 'Keywords saved successfully',
      keywords: onboarding.keywords
    })

  } catch (error) {
    console.error('Save keywords error:', error)

    res.status(500).json({
      message: 'Something went wrong',
      error: error.message
    })
  }
}

export const saveSources = async (req, res) => {
  try {
    const userId = req.user.id
    const { sources = [] } = req.body

    // Make sure sources is an array
    if (!Array.isArray(sources)) {
      return res.status(400).json({
        message: 'Sources must be an array'
      })
    }

    // Make sure at least one source exists
    if (sources.length === 0) {
      return res.status(400).json({
        message: 'At least one source is required'
      })
    }

    // Validate every row
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i]

      if (
        !source.x ||
        !source.facebook ||
        !source.reddit ||
        !source.youtube
      ) {
        return res.status(400).json({
          message: `Row ${i + 1} is incomplete`
        })
      }
    }

    // Validate URLs
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i]

      const urls = [
        source.x,
        source.facebook,
        source.reddit,
        source.youtube
      ]

      for (const url of urls) {
        try {
          const parsedUrl = new URL(url)

          if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            throw new Error()
          }
        } catch {
          return res.status(400).json({
            message: `Invalid URL in row ${i + 1}`
          })
        }
      }
    }

    // Save sources
    const onboarding = await Onboarding.findOneAndUpdate(
      { userId },
      {
        $set: {
          sources
        }
      },
      {
        new: true,
        upsert: true
      }
    )

    res.status(200).json({
      message: 'Sources saved successfully',
      sources: onboarding.sources
    })

  } catch (error) {
    console.error('Save sources error:', error)

    res.status(500).json({
      message: 'Something went wrong',
      error: error.message
    })
  }
}

export const savePublishers = async (req, res) => {
  try {
    const { publishers } = req.body

    if (!publishers || !Array.isArray(publishers)) {
      return res.status(400).json({
        message: 'Publishers must be an array'
      })
    }

    if (publishers.length === 0) {
      return res.status(400).json({
        message: 'At least one publisher is required'
      })
    }

    // Validate every publisher
    for (const publisher of publishers) {
      if (!publisher.websiteLink || !publisher.publicationName) {
        return res.status(400).json({
          message: 'Each publisher must have a website link and publication name'
        })
      }
    }

    const onboarding = await Onboarding.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: {
          publishers
        }
      },
      {
        new: true,
        upsert: true
      }
    )

    res.status(200).json({
      message: 'Publishers saved successfully',
      publishers: onboarding.publishers
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const getReview = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      'email firstName lastName jobTitle onboardingCompleted'
    )

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    const onboarding = await Onboarding.findOne({
      userId: req.user.id
    })

    if (!onboarding) {
      return res.status(404).json({
        message: 'Onboarding data not found'
      })
    }

    // Keyword counts
    const mainKeywords = onboarding.keywords.main.length
    const additionalKeywords = onboarding.keywords.additional.length
    const excludedKeywords = onboarding.keywords.excluded.length

    // Source counts
    const xSources = onboarding.sources.filter(
      source => source.x
    ).length

    const facebookSources = onboarding.sources.filter(
      source => source.facebook
    ).length

    const redditSources = onboarding.sources.filter(
      source => source.reddit
    ).length

    const youtubeSources = onboarding.sources.filter(
      source => source.youtube
    ).length

    // Publisher count
    const publishers = onboarding.publishers.length

    res.status(200).json({
      accountInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        position: user.jobTitle
      },

      sources: {
        x: xSources,
        facebook: facebookSources,
        reddit: redditSources,
        youtube: youtubeSources,
        publishers
      },

      keywords: {
        main: mainKeywords,
        additional: additionalKeywords,
        excluded: excludedKeywords
      },

      onboardingCompleted: user.onboardingCompleted
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const completeOnboarding = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    const onboarding = await Onboarding.findOne({
      userId: req.user.id
    })

    if (!onboarding) {
      return res.status(404).json({
        message: 'Onboarding data not found'
      })
    }

    // Make sure account information exists
    if (
      !user.firstName ||
      !user.lastName ||
      !user.jobTitle
    ) {
      return res.status(400).json({
        message: 'Account information is incomplete'
      })
    }

    // Make sure keywords exist
    if (
      !onboarding.keywords ||
      (
        onboarding.keywords.main.length === 0 &&
        onboarding.keywords.additional.length === 0 &&
        onboarding.keywords.excluded.length === 0
      )
    ) {
      return res.status(400).json({
        message: 'Keywords are incomplete'
      })
    }

    // Make sure sources exist
    if (
      !onboarding.sources ||
      onboarding.sources.length === 0
    ) {
      return res.status(400).json({
        message: 'Sources are incomplete'
      })
    }

    // Make sure publishers exist
    if (
      !onboarding.publishers ||
      onboarding.publishers.length === 0
    ) {
      return res.status(400).json({
        message: 'Publishers are incomplete'
      })
    }

    // Mark onboarding as completed
    user.onboardingCompleted = true

    await user.save()

    res.status(200).json({
      message: 'Onboarding completed successfully',
      onboardingCompleted: user.onboardingCompleted
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}