import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oexfntatuhhwesfiredq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9leGZudGF0dWhod2VzZmlyZWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MjA1MjgsImV4cCI6MjA4ODM5NjUyOH0.6uSFjedChNu1KXoivlVltLTmCnKxKEjdxiKZD9-zOCY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const auth = {
  signUp: async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: () => {
    return supabase.auth.getUser()
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}