import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Plane as Ambulance, Menu, X, User, LogOut, History, MapPin } from 'lucide-react'

const Header = () => {
  const { user, userProfile, signOut, isDriver } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Ambulance className="h-8 w-8 text-emergency-600" />
            <span className="text-xl font-bold text-gray-900">
              Ambulance Finder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-emergency-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                
                {!isDriver && (
                  <>
                    <Link
                      to="/book"
                      className="bg-emergency-600 text-white hover:bg-emergency-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Book Ambulance
                    </Link>
                    <Link
                      to="/history"
                      className="text-gray-700 hover:text-emergency-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      History
                    </Link>
                  </>
                )}

                {isDriver && (
                  <>
                    <Link
                      to="/driver/bookings"
                      className="text-gray-700 hover:text-emergency-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Bookings
                    </Link>
                    <Link
                      to="/driver/profile"
                      className="text-gray-700 hover:text-emergency-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Profile
                    </Link>
                  </>
                )}

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-emergency-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <User className="h-4 w-4" />
                    <span>{userProfile?.full_name || 'User'}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-emergency-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-emergency-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-emergency-600 text-white hover:bg-emergency-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-emergency-600 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-emergency-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  
                  {!isDriver && (
                    <>
                      <Link
                        to="/book"
                        className="bg-emergency-600 text-white hover:bg-emergency-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Book Ambulance
                      </Link>
                      <Link
                        to="/history"
                        className="text-gray-700 hover:text-emergency-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        History
                      </Link>
                    </>
                  )}

                  {isDriver && (
                    <>
                      <Link
                        to="/driver/bookings"
                        className="text-gray-700 hover:text-emergency-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Bookings
                      </Link>
                      <Link
                        to="/driver/profile"
                        className="text-gray-700 hover:text-emergency-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="text-left text-gray-700 hover:text-emergency-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/about"
                    className="text-gray-700 hover:text-emergency-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-emergency-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-emergency-600 text-white hover:bg-emergency-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header