import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {!user && <Footer />}
    </div>
  )
}

export default Layout