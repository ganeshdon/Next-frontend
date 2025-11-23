
import Footer from '@/components/Homepage/Footer'
import Header from '@/components/Homepage/Header'
import React from 'react'

const HomeLayout = ({children}) => {
  return (
    <div className='flex h-screen'>
        

        <div className='flex flex-col w-full'>
            <Header />
            <main className='flex-1'>{children}</main>
            <Footer />

        </div>
        
    </div>
  )
}

export default HomeLayout