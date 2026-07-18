import { db } from "@/lib/instantdb"
import { useUserStore } from "@/store/useUserStore"
import { EmojiPicker } from "./EmojiPicker"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ReactionBarProps {
  imageId: string
  imageUrl: string
}

export function ReactionBar({ imageId, imageUrl }: ReactionBarProps) {
  const { user } = useUserStore()
  
  const { data, isLoading } = db.useQuery({
    reactions: {
      $: {
        where: { imageId }
      }
    }
  })

  if (isLoading) return <div className="h-8 animate-pulse bg-muted rounded-full w-32" />

  const reactions = data?.reactions || []
  
  // Group reactions by emoji
  const groupedReactions = reactions.reduce((acc, curr) => {
    if (!acc[curr.emoji]) {
      acc[curr.emoji] = { count: 0, userIds: new Set<string>() }
    }
    acc[curr.emoji].count++
    acc[curr.emoji].userIds.add(curr.userId)
    return acc
  }, {} as Record<string, { count: number, userIds: Set<string> }>)

  const handleReact = (emoji: string) => {
    if (!user) return

    // Check if user already reacted with this emoji
    const existingReaction = reactions.find(r => r.userId === user.id && r.emoji === emoji)

    if (existingReaction) {
      // Toggle off (delete)
      db.transact([
        db.tx.reactions[existingReaction.id].delete()
      ])
    } else {
      // Toggle on (create)
      const reactionId = crypto.randomUUID()
      const activityId = crypto.randomUUID()
      
      db.transact([
        db.tx.users[user.id].update({
          username: user.username,
          color: user.color,
          avatarUrl: user.avatarUrl,
        }),
        db.tx.reactions[reactionId].update({
          imageId,
          userId: user.id,
          emoji,
          createdAt: Date.now(),
          imageUrl,
        }),
        db.tx.activities[activityId].update({
          type: 'reaction',
          imageId,
          userId: user.id,
          payload: emoji,
          createdAt: Date.now(),
          imageUrl,
        })
      ])
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <EmojiPicker onSelect={handleReact} />
      
      {Object.entries(groupedReactions).sort((a, b) => b[1].count - a[1].count).map(([emoji, { count, userIds }]) => {
        const hasReacted = user ? userIds.has(user.id) : false
        return (
          <Button
            key={emoji}
            variant={hasReacted ? "secondary" : "outline"}
            size="sm"
            onClick={() => handleReact(emoji)}
            className={cn(
              "h-8 rounded-full px-3 gap-1.5 transition-all",
              hasReacted ? "border-primary bg-primary/10" : ""
            )}
          >
            <span className="text-base leading-none">{emoji}</span>
            <span className="text-xs font-medium">{count}</span>
          </Button>
        )
      })}
    </div>
  )
}
