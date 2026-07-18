import { useEffect } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchImages } from "@/api/unsplash"
import { ImageCard } from "./ImageCard"
import { ImageSkeleton } from "./ImageSkeleton"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2 } from "lucide-react"
import { useUIStore } from "@/store/useUIStore"
import Masonry from "react-masonry-css"

const breakpointColumnsObj = {
  default: 4,
  1280: 3,
  768: 2,
  640: 1
};

export function ImageGrid() {
  const { setSelectedImage, searchQuery } = useUIStore()
  
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['images', searchQuery],
    queryFn: fetchImages,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (status === 'pending') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <ImageSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Failed to load images</h2>
        <p className="text-muted-foreground mb-6">There was an error connecting to the gallery service.</p>
        <Button onClick={() => fetchNextPage()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  // Flatten images from all pages
  const allImages = data.pages.flatMap((page) => page.images)

  return (
    <div className="pb-20">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-6"
        columnClassName="pl-6 bg-clip-padding space-y-6"
      >
        {allImages.map((image) => (
          <ImageCard 
            key={image.id} 
            image={image} 
            onClick={setSelectedImage} 
          />
        ))}
      </Masonry>

      {isFetchingNextPage && (
        <div className="flex justify-center p-8 mt-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!hasNextPage && data.pages[0].images.length > 0 && (
        <div className="text-center p-8 mt-4 text-muted-foreground">
          You've reached the end of the gallery.
        </div>
      )}
    </div>
  )
}

