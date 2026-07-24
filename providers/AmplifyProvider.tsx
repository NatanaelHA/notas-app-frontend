'use client'

import { Amplify } from 'aws-amplify'
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito'
import { CookieStorage } from 'aws-amplify/utils'
import config from '@/lib/amplify'

Amplify.configure(config, { ssr: true })
cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage())

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}