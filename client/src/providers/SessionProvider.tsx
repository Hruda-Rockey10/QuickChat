"use client"

import React from 'react'
import {SessionProvider as NextSessionProvider} from "next-auth/react"

interface Props {
  children?: React.ReactNode;
}

const SessionProvider = ({children}: Props) => {
  return (
    <NextSessionProvider>
        {children}
    </NextSessionProvider>
  )
}

export default SessionProvider