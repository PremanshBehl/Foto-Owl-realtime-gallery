import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { Search, Image as ImageIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserStore } from "@/store/useUserStore"
import { useUIStore } from "@/store/useUIStore"

export function Header() {
  const { user, initializeUser } = useUserStore()
  const { setSearchQuery } = useUIStore()
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    initializeUser()
  }, [initializeUser])

  // Debounced Auto-Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue.trim())
    }, 500)

    return () => clearTimeout(timer)
  }, [inputValue, setSearchQuery])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-8">
        <div className="flex items-center gap-2 mr-4 flex-1">
          <ImageIcon className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl hidden sm:inline-block">Realtime Gallery</span>
        </div>
        
        <div className="flex-1 flex justify-center max-w-md w-full px-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search images..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-muted/50 pl-9 rounded-full"
            />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <ThemeToggle />
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium hidden sm:inline-block" style={{ color: user.color }}>
                {user.username}
              </span>
              <Avatar className="h-8 w-8 ring-2 ring-background cursor-pointer">
                <AvatarImage src={user.avatarUrl} alt={user.username} />
                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

