import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useUIStore } from "@/store/useUIStore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReactionBar } from "@/components/reactions/ReactionBar"
import { CommentSection } from "@/components/comments/CommentSection"
import { cn } from "@/lib/utils"

export function ImageModal() {
  const { selectedImage, isImageModalOpen, closeImageModal } = useUIStore()
  const [isZoomed, setIsZoomed] = useState(false)

  if (!selectedImage) return null

  const handleClose = () => {
    setIsZoomed(false)
    closeImageModal()
  }

  return (
    <Dialog open={isImageModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col md:flex-row gap-0 border-none bg-background rounded-xl">
        
        {/* Hidden titles for screen readers */}
        <div className="sr-only">
          <DialogTitle>Image View</DialogTitle>
          <DialogDescription>Viewing image by {selectedImage.user.name}</DialogDescription>
        </div>

        {/* Left Side - Image */}
        <div className={cn("flex-1 bg-black/95 relative flex", isZoomed ? "overflow-auto items-start justify-start" : "items-center justify-center overflow-hidden")}>
          <img
            src={isZoomed ? selectedImage.urls.full : selectedImage.urls.regular}
            alt={selectedImage.alt_description || "Gallery Image"}
            onClick={() => setIsZoomed(!isZoomed)}
            className={cn(
              "transition-all duration-300",
              isZoomed ? "w-auto h-auto max-w-none cursor-zoom-out" : "w-full h-full object-contain cursor-zoom-in"
            )}
          />
        </div>

        {/* Right Side - Interactions */}
        <div className="w-full md:w-[400px] flex flex-col h-full bg-background border-l relative">
          
          {/* Header - Photographer Info */}
          <div className="p-4 border-b flex items-center space-x-3 shrink-0">
            <Avatar className="h-10 w-10 ring-2 ring-primary/10">
              <AvatarImage src={selectedImage.user.profile_image.medium} alt={selectedImage.user.username} />
              <AvatarFallback>{selectedImage.user.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-none">{selectedImage.user.name}</span>
              <span className="text-xs text-muted-foreground mt-1">@{selectedImage.user.username}</span>
            </div>
          </div>

          <div className="px-4 pt-4 shrink-0">
            <div className="text-sm text-muted-foreground italic mb-2 line-clamp-3">
              {selectedImage.description || "No description provided."}
            </div>
            <div className="py-3">
              <ReactionBar imageId={selectedImage.id} imageUrl={selectedImage.urls.thumb} />
            </div>
            <div className="border-b -mx-4" />
          </div>

          {/* Comments Section (Takes remaining space and has own scroll/input) */}
          <div className="flex-1 min-h-0">
            <CommentSection imageId={selectedImage.id} imageUrl={selectedImage.urls.thumb} />
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}


