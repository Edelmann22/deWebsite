"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import EventEditor from "@/components/event-editor"
import { useSession } from "@/hooks/use-session"

export default function NewEventPage() {
  const router = useRouter()
  const { user, loading } = useSession()
  const [error, setError] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h1 className="text-xl font-semibold text-foreground">Admin access required</h1>
            <p className="mt-2 text-sm text-muted-foreground">Only administrators can create events.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create event</h1>
            <p className="mt-2 text-sm text-muted-foreground">Share announcements in a clean, blog-style layout.</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Back to calendar
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <EventEditor
          onCancel={() => router.push("/")}
          onSave={async (payload) => {
            setError(null)
            const res = await fetch("/api/events", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
            if (!res.ok) {
              const data = await res.json().catch(() => null)
              setError(data?.error ?? "Failed to create event")
              return
            }
            router.push("/")
          }}
          submitLabel="Publish event"
        />
      </div>
    </div>
  )
}
