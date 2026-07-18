import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SmilePlus } from "lucide-react"

const EMOJIS = ["❤️", "🔥", "😂", "😍", "👍", "🎉", "😮", "🙌"]

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 rounded-full">
          <SmilePlus className="h-4 w-4" />
          <span>React</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 border-none shadow-lg rounded-xl" align="start">
        <div className="flex gap-2">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onSelect(emoji)
                setOpen(false)
              }}
              className="text-xl hover:scale-125 transition-transform p-1 rounded-md hover:bg-muted"
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
