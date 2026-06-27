import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const base = 'rounded-xl bg-white dark:bg-secondary-900 shadow-card transition-shadow duration-200'
    const glass = 'glass shadow-card-hover'
    return (
      <div
        ref={ref}
        className={twMerge(base, variant === 'glass' && glass, className)}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'
export default Card
