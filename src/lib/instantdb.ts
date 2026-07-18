import { init } from "@instantdb/react"
import type { Reaction, Comment, Activity, LocalUser } from "@/types"

const APP_ID = import.meta.env.VITE_INSTANTDB_APP_ID

if (!APP_ID) {
  console.error("VITE_INSTANTDB_APP_ID is missing from .env.local")
}

// Define the schema for InstantDB namespaces based on our TS interfaces
// Note: InstantDB is schema-less by default, but we enforce types via generic schema definition
interface AppSchema {
  reactions: Reaction
  comments: Comment
  activities: Activity
  users: LocalUser
}

export const db = init<AppSchema>({ appId: APP_ID })
