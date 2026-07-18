import { ThemeProvider } from "@/components/common/ThemeProvider"
import { Layout } from "@/components/layout/Layout"
import { Toaster } from "@/components/ui/toaster"
import { ImageGrid } from "@/components/gallery/ImageGrid"
import { ImageModal } from "@/components/image/ImageModal"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Layout>
        <ImageGrid />
      </Layout>
      <ImageModal />
      <Toaster />
    </ThemeProvider>
  )
}

export default App

