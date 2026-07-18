import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LocalUser } from '@/types'

interface UserState {
  user: LocalUser | null
  initializeUser: () => void
}

const adjectives = ['Happy', 'Brave', 'Clever', 'Swift', 'Bright', 'Calm', 'Eager', 'Fierce']
const nouns = ['Owl', 'Fox', 'Bear', 'Lion', 'Wolf', 'Hawk', 'Tiger', 'Eagle']
const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef']

function generateRandomUser(): LocalUser {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
  const username = `${randomAdjective}${randomNoun}${Math.floor(Math.random() * 1000)}`
  const color = colors[Math.floor(Math.random() * colors.length)]
  
  // Using DiceBear for modern avatars
  const avatarUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${username}&backgroundColor=${color.replace('#', '')}`

  return {
    id: crypto.randomUUID(),
    username,
    color,
    avatarUrl,
  }
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      initializeUser: () => set((state) => {
        if (!state.user) {
          return { user: generateRandomUser() }
        }
        return state
      }),
    }),
    {
      name: 'foto-owl-user-storage',
    }
  )
)
