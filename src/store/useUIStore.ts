import { create } from 'zustand'
import type { UnsplashImage } from '@/types'

interface UIState {
  selectedImage: UnsplashImage | null
  isImageModalOpen: boolean
  searchQuery: string
  setSelectedImage: (image: UnsplashImage | null) => void
  closeImageModal: () => void
  setSearchQuery: (query: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  selectedImage: null,
  isImageModalOpen: false,
  searchQuery: "",
  setSelectedImage: (image) => set({ selectedImage: image, isImageModalOpen: !!image }),
  closeImageModal: () => set({ selectedImage: null, isImageModalOpen: false }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
