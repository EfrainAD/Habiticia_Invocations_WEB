'use client'
import { useHabitica } from '../context/habiticaAuth'

export default function Page() {
   const { habiticaAuth } = useHabitica()

   return (
      <>
         <h1>habitica Crudentials</h1>

         <p>user id: {habiticaAuth.userId}</p>
         <p>key id: {habiticaAuth.apiKey}</p>
      </>
   )
}
