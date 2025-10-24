'use client'
import axios from 'axios'

export const habiticaAxios = axios.create({
   baseURL: 'https://habitica.com/api/v3',
   headers: {'x-client': process.env.NEXT_PUBLIC_HABITICA_CLIENT},
})

habiticaAxios.interceptors.response.use((response) => {
   const headers = response.headers

   if ('x-ratelimit-remaining' in headers) {
      const remaining = parseInt(headers['x-ratelimit-remaining'], 10)
      localStorage.setItem('x-ratelimit-remaining', remaining)
   }
   if ('x-ratelimit-reset' in headers) {
      const resetDate = new Date(headers['x-ratelimit-reset'])
      const resetTime = resetDate.getTime()
      localStorage.setItem('x-ratelimit-reset', resetTime)
   }

   return response
})

habiticaAxios.interceptors.request.use(async (config) => {
   const remaining = parseInt(localStorage.getItem('x-ratelimit-remaining'), 10)
   const reset = parseInt(localStorage.getItem('x-ratelimit-reset'), 10)

   if (!isNaN(remaining) && remaining <= 0 && !isNaN(reset)) {
      const waitMs = reset - Date.now()
      if (waitMs > 0) {
         await new Promise((resolve) => setTimeout(resolve, waitMs))
      }
   }

   return config
})
