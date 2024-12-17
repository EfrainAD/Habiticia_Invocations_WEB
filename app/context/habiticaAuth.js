'use client'

import { createContext, useContext, useState } from 'react'

const HabiticaContext = createContext()

export const HabiticaProvider = ({ children }) => {
   const [habiticaAuth, setHabiticaAuth] = useState({
      userId: '',
      apiKey: '',
   })

   const isHabiticaAuth = !!habiticaAuth.userId && !!habiticaAuth.apiKey

   const updateHabiticaAuth = ({ userId, apiKey }) => {
      setHabiticaAuth({ userId, apiKey })
   }

   return (
      <HabiticaContext.Provider
         value={{
            habiticaAuth,
            isHabiticaAuth,
            updateHabiticaAuth,
         }}
      >
         {children}
      </HabiticaContext.Provider>
   )
}

export const useHabitica = () => useContext(HabiticaContext)
