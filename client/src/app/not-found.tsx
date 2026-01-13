import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Notfound = () => {
  return (
    <div className='h-screen flex justify-center items-center flex-col'>
        <Image
            src='/images/404.svg'
            alt='404'
            width={500}
            height={500}
        />
        <Link href="/">
            <Button>Return to Home</Button>
        </Link>
    </div>
  )
}

export default Notfound