import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, userData) => {
    setLoading(true)
    try {
      const result = await auth.signUp(email, password, userData)
      return result
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    setLoading(true)
    try {
      const result = await auth.signIn(email, password)
      return result
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const result = await auth.signOut()
      return result
    } finally {
      setLoading(false)
    }
  }

  const signInWithProvider = async (provider, redirectTo) => {
    setLoading(true)
    try {
      const result = await auth.signInWithOAuth(provider, redirectTo)
      return result
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut
    , signInWithProvider
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}