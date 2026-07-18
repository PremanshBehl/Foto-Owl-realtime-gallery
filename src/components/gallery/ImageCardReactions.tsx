import { db } from "@/lib/instantdb"
import { Heart, MessageCircle } from "lucide-react"
import { useUserStore } from "@/store/useUserStore"
import { cn } from "@/lib/utils"

interface ImageCardReactionsProps {
  imageId: string
  imageUrl: string
}

export function ImageCardReactions({ imageId, imageUrl }: ImageCardReactionsProps) {
  const { user } = useUserStore()
  
  const { data, isLoading } = db.useQuery({
    reactions: {
      $: {
        where: { imageId }
      }
    },
    comments: {
      $: {
        where: { imageId }
      }
    }
  })

  if (isLoading) return null

  const reactions = data?.reactions || []
  const commentsCount = data?.comments?.length || 0

  // Find the top emoji
  const grouped = reactions.reduce((acc, curr) => {
    acc[curr.emoji] = (acc[curr.emoji] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topEmoji = Object.entries(grouped).sort((a, b) => b[1] - a[1])[0]

  const handleQuickReact = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening the modal
    if (!user) return

    const defaultEmoji = "❤️"
    const existing = reactions.find(r => r.userId === user.id && r.emoji === defaultEmoji)

    if (existing) {
      db.transact([db.tx.reactions[existing.id].delete()])
    } else {
      const reactionId = crypto.randomUUID()
      const activityId = crypto.randomUUID()
      
      db.transact([
        db.tx.reactions[reactionId].update({
          imageId,
          userId: user.id,
          emoji: defaultEmoji,
          createdAt: Date.now(),
          imageUrl,
        }),
        db.tx.activities[activityId].update({
          type: 'reaction',
          imageId,
          userId: user.id,
          payload: defaultEmoji,
          createdAt: Date.now(),
          imageUrl,
        })
      ])
    }
  }

  const hasReactedHeart = user && reactions.some(r => r.userId === user.id && r.emoji === "❤️")

  return (
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
      <div className="flex gap-4 text-white">
        
        {/* Quick React Button */}
        <button 
          onClick={handleQuickReact}
          className="flex items-center gap-1.5 hover:scale-110 transition-transform p-2 rounded-full hover:bg-white/20"
        >
          <Heart className={cn("w-6 h-6", hasReactedHeart ? "fill-red-500 text-red-500" : "fill-white/20")} />
          <span className="font-medium text-lg">{reactions.length > 0 ? reactions.length : "React"}</span>
        </button>

        {/* Top Emoji Indicator (if different from heart and exists) */}
        {topEmoji && topEmoji[0] !== "❤️" && (
          <div className="flex items-center gap-1.5 p-2">
            <span className="text-xl">{topEmoji[0]}</span>
            <span className="font-medium text-lg">{topEmoji[1]}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 p-2">
          <MessageCircle className="w-6 h-6 fill-white/20" />
          <span className="font-medium text-lg">{commentsCount}</span>
        </div>
      </div>
    </div>
  )
}
