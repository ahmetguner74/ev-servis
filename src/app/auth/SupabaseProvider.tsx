"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js'

type SupabaseContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  session: null,
  isLoading: true,
})

export const useSupabase = () => useContext(SupabaseContext)

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mevcut oturumu al
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    }

    getSession()

    // Oturum durumu değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <SupabaseContext.Provider value={{ user, session, isLoading }}>
      {children}
    </SupabaseContext.Provider>
  )
} 