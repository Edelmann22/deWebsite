"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import EventEditor from "@/components/event-editor"
import type { EventRow } from "@/lib/db"
import { useSession } from "@/hooks/use-session"

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { user, loading } = useSession()
  const [event, setEvent] = useState<EventRow | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingEvent, setLoadingEvent] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      if (!params?.id) return
      setLoadingEvent(true)
      const res = await fetch(`/api/events/${params.id}`)
      if (!res.ok) {
        setError("Event not found.")
        setLoadingEvent(false)
        return
      }
      const data = await res.json()
      setEvent(data)
      setLoadingEvent(false)
    }

    fetchEvent()
  }, [params?.id])

  if (loading || loadingEvent) {
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
            <p className="mt-2 text-sm text-muted-foreground">Only administrators can edit events.</p>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h1 className="text-xl font-semibold text-foreground">Event not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">This event might have been deleted.</p>
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
            <h1 className="text-3xl font-bold text-foreground">Edit event</h1>
            <p className="mt-2 text-sm text-muted-foreground">Update the details or polish the story.</p>
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
          initial={event}
          onCancel={() => router.push("/")}
          onSave={async (payload) => {
            setError(null)
            const res = await fetch(`/api/events/${event.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
            if (!res.ok) {
              const data = await res.json().catch(() => null)
              setError(data?.error ?? "Failed to update event")
              return
            }
            const updated = await res.json()
            setEvent(updated)
            router.push("/")
          }}
          submitLabel="Update event"
        />
      </div>
    </div>
  )
}
