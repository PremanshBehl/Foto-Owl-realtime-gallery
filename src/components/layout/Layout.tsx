import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <main className="flex-1 w-full lg:pr-80">
          <div className="container p-4 md:p-8">
            {children}
          </div>
        </main>
        <Sidebar />
      </div>
    </div>
  )
}
