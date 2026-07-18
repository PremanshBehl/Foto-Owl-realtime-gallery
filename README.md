# Realtime Gallery 📷⚡

A modern, multi-user real-time image interaction web application built for the React Intern Assignment. It allows users to browse an Unsplash-powered gallery, open focused image views, react with emojis, comment, and instantly see interactions sync across all active clients.

## 🚀 Setup Instructions

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your keys:
   ```env
   VITE_UNSPLASH_ACCESS_KEY="your_unsplash_access_key"
   VITE_INSTANTDB_APP_ID="your_instantdb_app_id"
   ```
   *Note: If you don't provide an Unsplash key, the app gracefully falls back to generating beautiful mocked placeholder images so it remains completely functional!*
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗 API Handling Strategy

**Unsplash API & TanStack React Query**
We handle the core gallery fetching using `fetch` wrapped in **React Query** (`useInfiniteQuery`). This provides out-of-the-box features like:
- **Infinite Scrolling**: Automatically paginates next sets of 30 images as you scroll.
- **Caching**: Drastically reduces network calls when navigating.
- **Background Refetching**: Ensures the gallery remains up to date.
- **Loading & Error States**: Declarative handling of UI states (e.g., `ImageSkeleton`).

## ⚡ InstantDB Schema & Usage

InstantDB serves as the real-time websocket layer. It operates schemaless, but we enforce the following types:

- **`users`**: `{ id, username, color, avatarUrl }` - Randomly generated local identities.
- **`reactions`**: `{ id, imageId, userId, emoji, createdAt, imageUrl }`
- **`comments`**: `{ id, imageId, userId, text, createdAt, serverCreatedAt }`
- **`activities`**: `{ id, type, imageId, userId, payload, createdAt, imageUrl }` - A dedicated namespace that unions both comments and reactions. This makes the global Activity Feed highly performant to query.

*Usage*: Clients mutate these namespaces using `db.transact()`. InstantDB instantly pushes updates via websockets, triggering UI re-renders for any component subscribed via `db.useQuery()`.

## ⚛️ Key React Decisions

- **Strict Functional Components**: Built entirely with React 19 hooks and functional components.
- **State Separation**:
  - *Server State*: TanStack React Query (Unsplash)
  - *Real-Time State*: InstantDB SDK (Comments, Reactions, Feed)
  - *Client State*: Zustand (Theme toggle, Selected Image Modal state, Local User Identity)
- **Component Decomposition**: The application is highly modular (e.g., `ImageGrid` -> `ImageCard` -> `ImageCardReactions`).
- **Performance Optimization**: Lazy-loaded images with `loading="lazy"`, targeted InstantDB subscriptions per `imageId` rather than pulling the entire database, and CSS-based hover transitions over React re-renders.
- **UI Architecture**: Tailwind CSS combined with `shadcn/ui` and `framer-motion` for a premium, accessible, and dynamic user experience.

## 🧗 Challenges Faced & Solutions

1. **Global Feed Complexity**: Initially, combining reactions and comments into a single chronological feed required complex client-side merging and sorting.
   *Solution*: I implemented a dedicated `activities` namespace in InstantDB. Now, whenever a user reacts or comments, a transaction writes to both the entity namespace and the `activities` namespace, making the sidebar feed extremely fast and simple to query.
2. **InstantDB Image Context**: When someone clicks a feed item, we needed a way to open the full image in the modal without making a fresh Unsplash API call.
   *Solution*: By leveraging React Query's `queryClient.getQueryData()`, we search the existing local cache for the `imageId` and hydrate the Zustand UI store instantly.

## 🔮 What I Would Improve With More Time

1. **Typing Indicators & Presence**: Show when other users are currently viewing the same image or typing a comment (InstantDB presence features).
2. **Masonry Layout**: Replace the standard CSS grid with a true Masonry layout (like Pinterest) for photos with varying aspect ratios.
3. **Advanced Conflict Handling**: Though InstantDB handles real-time syncing elegantly, implementing offline-support queues and advanced conflict resolution.
4. **Image Zooming**: Double-tap or pinch-to-zoom gestures inside the Image Modal for a better mobile experience.
