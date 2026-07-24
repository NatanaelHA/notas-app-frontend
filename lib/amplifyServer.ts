import { createServerRunner } from '@aws-amplify/adapter-nextjs'
import config from './amplify'

export const { runWithAmplifyServerContext } = createServerRunner({ config })
