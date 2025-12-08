import { cn } from '@/utilities/ui'

type Props = {
  isAtBottom: boolean
  className?: string
}

export const CompletionCard = ({ isAtBottom, className }: Props) => {
  return (
    <div
      className={cn(
        'relative flex items-center gap-3 rounded-xl p-4 transition-all duration-500',
        isAtBottom
          ? 'bg-card shadow-[0_0_20px_-5px_rgba(233,66,53,0.3)] translate-y-0 opacity-100'
          : 'bg-card translate-y-2',
        className,
      )}
    >
      {/* Snake Border Animation (Active Only, Full Border) */}
      {isAtBottom && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute top-[50%] left-[50%] h-[200%] w-[200%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,_#E94235_90deg,_transparent_180deg)] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute inset-[1px] bg-card rounded-xl" />
        </div>
      )}

      {/* Tick Circle */}
      <div
        className={cn(
          'relative z-10 size-6 shrink-0 rounded-full flex items-center justify-center border transition-colors duration-500',
          isAtBottom
            ? 'bg-green-500 border-green-500 text-white'
            : 'bg-muted border-border text-muted-foreground',
        )}
      >
        <div className="size-4 flex items-center justify-center">
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Text Content */}
      <div className="relative z-10 flex flex-col gap-0.5">
        <span
          className={cn(
            'font-bold text-sm tracking-tight transition-colors',
            isAtBottom ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          Congratulations!
        </span>
        <span className="text-xs text-muted-foreground">
          You’ve thoroughly explored this topic!
        </span>
      </div>

      {/* Extra Glow/Shimmer overlay */}
      {isAtBottom && (
        <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-tr from-white/10 to-transparent mix-blend-overlay" />
      )}
    </div>
  )
}
