import { Skeleton } from "@/components/ui/skeleton"

export function ImageSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[300px] w-full rounded-xl" />
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </div>
    </div>
  )
}
