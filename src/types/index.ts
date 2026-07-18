export interface UnsplashUser {
  id: string
  username: string
  name: string
  profile_image: {
    small: string
    medium: string
    large: string
  }
}

export interface UnsplashImage {
  id: string
  created_at: string
  width: number
  height: number
  color: string
  description: string | null
  alt_description: string | null
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  user: UnsplashUser
}

export interface LocalUser {
  id: string
  username: string
  color: string
  avatarUrl: string
}

export interface Reaction {
  id: string
  imageId: string
  userId: string
  emoji: string
  createdAt: number
}

export interface Comment {
  id: string
  imageId: string
  userId: string
  text: string
  createdAt: number
}

export interface Activity {
  id: string
  type: 'reaction' | 'comment'
  imageId: string
  userId: string
  payload: string // emoji or comment text
  createdAt: number
  imageUrl: string // thumbnail for the feed
}
