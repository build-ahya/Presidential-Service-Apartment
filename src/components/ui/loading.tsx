'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type LoadingProps = {
  label?: string
  className?: string
  fullScreen?: boolean
}

export default function Loading({ label = 'Loading…', className, fullScreen = true }: LoadingProps) {
  return (
    <div
      className={cn(
        fullScreen ? 'h-screen w-full flex items-center justify-center' : 'inline-flex items-center',
        'gap-2 text-muted-foreground',
        className || ''
      )}
      role="status"
      aria-live="polite"
    >
      <span
        className="inline-block h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin"
        aria-hidden="true"
      />
      <span className="text-sm">{label}</span>
    </div>
  )
}
