"use client"

import { useRef, useEffect } from "react"

type Props = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  minRows?: number
  className?: string
}

export default function AutoTextarea({ value, onChange, placeholder, minRows = 3, className = "" }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto"
      ref.current.style.height = `${ref.current.scrollHeight}px`
    }
  }, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      placeholder={placeholder}
      rows={minRows}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full resize-none overflow-hidden rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition leading-relaxed ${className}`}
    />
  )
}
