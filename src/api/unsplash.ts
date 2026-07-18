import type { UnsplashImage } from "@/types"

const UNSPLASH_API_URL = "https://api.unsplash.com"
const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

export async function fetchImages({ pageParam = 1, queryKey }: any): Promise<{ images: UnsplashImage[], nextCursor: number | null }> {
  const [, searchQuery] = queryKey

  if (!ACCESS_KEY) {
    console.warn("VITE_UNSPLASH_ACCESS_KEY is missing. Using mock data.")
    return getMockImages(pageParam, searchQuery)
  }

  const endpoint = searchQuery 
    ? `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&page=${pageParam}&per_page=30`
    : `${UNSPLASH_API_URL}/photos?page=${pageParam}&per_page=30&order_by=latest`

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Client-ID ${ACCESS_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch images from Unsplash")
  }

  const rawData = await response.json()
  const data: UnsplashImage[] = searchQuery ? rawData.results : rawData
  
  return {
    images: data,
    nextCursor: data.length > 0 ? pageParam + 1 : null,
  }
}

// Fallback mock data if no API key is provided
async function getMockImages(page: number, searchQuery: string = ""): Promise<{ images: UnsplashImage[], nextCursor: number | null }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  if (page > 3) return { images: [], nextCursor: null } // Limit mock data to 3 pages

  const mockImages: UnsplashImage[] = Array.from({ length: 30 }).map((_, i) => {
    const id = `mock-${page}-${i}`
    const seed = page * 100 + i
    return {
      id,
      created_at: new Date().toISOString(),
      width: 1080,
      height: Math.floor(Math.random() * 500) + 800, // Random height for masonry-like feel
      color: "#e2e8f0",
      description: `Mock Image ${id} ${searchQuery ? `for ${searchQuery}` : ''}`,
      alt_description: "A beautifully mocked placeholder image",
      urls: {
        raw: `https://picsum.photos/seed/${seed}/1080/1080`,
        full: `https://picsum.photos/seed/${seed}/1080/1080`,
        regular: `https://picsum.photos/seed/${seed}/800/800`,
        small: `https://picsum.photos/seed/${seed}/400/400`,
        thumb: `https://picsum.photos/seed/${seed}/200/200`,
      },
      user: {
        id: `user-${seed}`,
        username: `photographer_${seed}`,
        name: `Photographer ${seed}`,
        profile_image: {
          small: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
          medium: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
          large: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
        }
      }
    }
  })

  return {
    images: mockImages,
    nextCursor: page + 1
  }
}
