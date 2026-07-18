import type { UnsplashImage } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageCardReactions } from "./ImageCardReactions"

interface ImageCardProps {
  image: UnsplashImage
  onClick: (image: UnsplashImage) => void
}

export function ImageCard({ image, onClick }: ImageCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 border-none bg-muted/20"
      onClick={() => onClick(image)}
    >
      <div className="relative overflow-hidden bg-muted group-hover:rounded-t-xl transition-all duration-300">
        <img
          src={image.urls.regular}
          alt={image.alt_description || "Gallery Image"}
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ aspectRatio: `${image.width} / ${image.height}` }}
          loading="lazy"
        />
        
        {/* Real-time Hover Overlay */}
        <ImageCardReactions imageId={image.id} imageUrl={image.urls.thumb} />
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 ring-2 ring-background">
              <AvatarImage src={image.user.profile_image.small} alt={image.user.username} />
              <AvatarFallback>{image.user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">{image.user.name}</span>
              <span className="text-xs text-muted-foreground mt-1">@{image.user.username}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
