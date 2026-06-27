import { twMerge } from 'tailwind-merge'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={twMerge('animate-pulse rounded-lg bg-secondary-200 dark:bg-secondary-700', className)}
      {...props}
    />
  )
}
