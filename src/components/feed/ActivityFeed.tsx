import { db } from "@/lib/instantdb"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUIStore } from "@/store/useUIStore"
import { useQueryClient } from "@tanstack/react-query"
import type { UnsplashImage } from "@/types"
import { motion, AnimatePresence } from "framer-motion"

export function ActivityFeed() {
  const { setSelectedImage } = useUIStore()
  const queryClient = useQueryClient()
  
  const { data, isLoading } = db.useQuery({
    activities: {},
    users: {}
  })

  // To focus the image from the feed, we need the full UnsplashImage object.
  // We can look it up in the React Query cache, or just construct a partial one if needed, 
  // but let's try to find it in the cache first.
  const handleFeedItemClick = (imageId: string) => {
    const cachedData = queryClient.getQueryData<any>(['images'])
    let imageObj: UnsplashImage | null = null
    
    if (cachedData) {
      for (const page of cachedData.pages) {
        const found = page.images.find((img: UnsplashImage) => img.id === imageId)
        if (found) {
          imageObj = found
          break
        }
      }
    }

    if (imageObj) {
      setSelectedImage(imageObj)
    }
  }

  if (isLoading) {
    return (
      <div className="h-full py-6 pl-6 pr-6 lg:py-8 space-y-4 animate-pulse">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Live Activity</h2>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-muted rounded w-3/4" />
              <div className="h-2 bg-muted rounded w-1/2" />
            </div>
            <div className="w-10 h-10 rounded-md bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  const activities = data?.activities || []
  const enrichedActivities = activities.map((act: any) => ({
    ...act,
    user: data?.users.find((u: any) => u.id === act.userId)
  }))
  .sort((a: any, b: any) => b.createdAt - a.createdAt)
  .slice(0, 50)

  return (
    <ScrollArea className="h-full py-6 pl-6 pr-6 lg:py-8">
      <h2 className="mb-4 text-lg font-semibold tracking-tight flex items-center gap-2">
        Live Activity 
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </h2>
      
      {enrichedActivities.length === 0 ? (
        <div className="text-sm text-muted-foreground mt-10 text-center">
          No activity yet. Be the first to interact!
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {enrichedActivities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => handleFeedItemClick(activity.imageId)}
              >
                <Avatar className="h-8 w-8 shrink-0 mt-1">
                  <AvatarImage src={activity.user?.avatarUrl} />
                  <AvatarFallback>{activity.user?.username?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1 overflow-hidden">
                  <p className="text-sm leading-tight text-foreground/90">
                    <span className="font-semibold" style={{ color: activity.user?.color }}>
                      {activity.user?.username || 'Unknown'}
                    </span>
                    {" "}
                    {activity.type === 'reaction' ? (
                      <>reacted {activity.payload}</>
                    ) : (
                      <>commented: <span className="italic">"{activity.payload}"</span></>
                    )}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(activity.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                {activity.imageUrl && (
                  <div className="w-10 h-10 shrink-0 rounded-md overflow-hidden bg-muted relative group-hover:ring-2 ring-primary/20">
                    <img src={activity.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </ScrollArea>
  )
}
