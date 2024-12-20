'use client'

import { useHabitica } from '@/app/context/habiticaAuth.js'
import AuthButton from './AuthButton.js'
import HabiticaForm from './habiticaAuth/HabiticaForm.js'
import Link from 'next/link.js'

export default function NavMenu() {
   const { isHabiticaAuth } = useHabitica()

   return (
      <>
         <Link href={'/'}>home</Link>
         <Link href={'/habitica'}>Habitica</Link>
         <Link href={'/gear'}>Gear</Link>
         <AuthButton />
         {isHabiticaAuth ? 'Habitica Auth is Set' : <HabiticaForm />}
      </>
   )
}
