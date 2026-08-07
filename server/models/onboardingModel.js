import { Schema, model } from 'mongoose'

const onboardingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },

    keywords: {
      main: {
        type: [String],
        default: []
      },

      additional: {
        type: [String],
        default: []
      },

      excluded: {
        type: [String],
        default: []
      }
    },

    sources: [
      {
        x: {
          type: String,
          required: true
        },

        facebook: {
          type: String,
          required: true
        },

        reddit: {
          type: String,
          required: true
        },

        youtube: {
          type: String,
          required: true
        }
      }
    ],

    publishers: [
      {
        websiteLink: {
          type: String,
          required: true,
          trim: true
        },

        publicationName: {
          type: String,
          required: true,
          trim: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

const Onboarding = model('Onboarding', onboardingSchema)

export default Onboarding