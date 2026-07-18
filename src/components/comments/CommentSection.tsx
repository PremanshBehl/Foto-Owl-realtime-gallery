import { useState, useRef, useEffect } from "react"
import { db } from "@/lib/instantdb"
import { useUserStore } from "@/store/useUserStore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Trash2 } from "lucide-react"

interface CommentSectionProps {
  imageId: string
  imageUrl: string
}

export function CommentSection({ imageId, imageUrl }: CommentSectionProps) {
  const { user } = useUserStore()
  const [text, setText] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  
  const { data, isLoading } = db.useQuery({
    comments: {
      $: {
        where: { imageId }
      }
    },
    users: {},
    typing: {
      $: {
        where: { imageId }
      }
    }
  })

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Scroll to bottom when new comments arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [data?.comments?.length])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !user) return

    const commentId = crypto.randomUUID()
    const activityId = crypto.randomUUID()
    
    db.transact([
      // Ensure the user exists in the DB so we can join user info for comments
      db.tx.users[user.id].update({
        username: user.username,
        color: user.color,
        avatarUrl: user.avatarUrl,
      }),
      // Create the comment
      db.tx.comments[commentId].update({
        imageId,
        userId: user.id,
        text: text.trim(),
        createdAt: Date.now(),
      }),
      // Create the activity feed entry
      db.tx.activities[activityId].update({
        type: 'comment',
        imageId,
        userId: user.id,
        payload: text.trim(),
        createdAt: Date.now(),
        imageUrl,
      }),
      // Clear typing indicator
      db.tx.typing[user.id].delete()
    ])

    setText("")
  }

  const handleDelete = (commentId: string) => {
    db.transact([
      db.tx.comments[commentId].delete()
    ])
  }

  const handleKeyDown = () => {
    if (!user) return
    
    db.transact([
      db.tx.typing[user.id].update({
        imageId,
        username: user.username,
        updatedAt: Date.now()
      })
    ])
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      db.transact([
        db.tx.typing[user.id].delete()
      ])
    }, 2000)
  }

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground text-sm">Loading comments...</div>
  }

  const comments = data?.comments || []
  // Map user details to comments
  const enrichedComments = comments.map(comment => {
    const commentUser = data?.users.find(u => u.id === comment.userId)
    return { ...comment, user: commentUser }
  }).sort((a, b) => a.createdAt - b.createdAt)

  // Find active typers from DB
  const activeTypers = data?.typing?.filter(
    t => t.updatedAt > Date.now() - 3000 && t.username !== user?.username
  ) || []

  return (
    <div className="flex flex-col h-full">
      {/* Comment List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {enrichedComments.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground mt-8">
            No comments yet. Be the first!
          </div>
        ) : (
          enrichedComments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              <Avatar className="h-8 w-8 mt-0.5 shrink-0">
                <AvatarImage src={comment.user?.avatarUrl} />
                <AvatarFallback>{comment.user?.username?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: comment.user?.color }}>
                    {comment.user?.username || 'Unknown'}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 break-words">{comment.text}</p>
              </div>
              
              {user?.id === comment.userId && (
                <button 
                  onClick={() => handleDelete(comment.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity shrink-0 px-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-background border-t mt-auto relative">
        {/* Typing Indicator */}
        {activeTypers.length > 0 && (
          <div className="absolute -top-6 left-4 text-xs text-muted-foreground italic flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
            </span>
            {activeTypers.map((p: any) => p.username).filter(Boolean).join(", ")} {activeTypers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment..."
            className="flex-1 rounded-full bg-muted/50 border-none focus-visible:ring-1"
            maxLength={200}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!text.trim() || !user}
            className="rounded-full shrink-0 h-10 w-10"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )

}
