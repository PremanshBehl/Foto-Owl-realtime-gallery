import { ActivityFeed } from "@/components/feed/ActivityFeed"

export function Sidebar() {
  return (
    <aside className="fixed right-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-80 shrink-0 border-l lg:block bg-background">
      <ActivityFeed />
    </aside>
  )
}

