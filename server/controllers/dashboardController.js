import Onboarding from '../models/onboardingModel.js'

export const getSources = async (req, res) => {
  try {
    const onboarding = await Onboarding.findOne({
      userId: req.user.id
    }).select('sources')

    if (!onboarding) {
      return res.status(404).json({
        message: 'Onboarding data not found'
      })
    }

    res.status(200).json({
      sources: onboarding.sources
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export const getPublishers = async (req, res) => {
  try {
    const onboarding = await Onboarding.findOne({
      userId: req.user.id
    }).select('publishers')

    if (!onboarding) {
      return res.status(404).json({
        message: 'Onboarding data not found'
      })
    }

    res.status(200).json({
      publishers: onboarding.publishers
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}