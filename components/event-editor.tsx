"use client"

import { useEffect, useRef, useState } from "react"
import { Bold, Italic, Underline, List, ListOrdered, Quote, Heading2, Heading3, Link2, ImagePlus } from "lucide-react"
import type { EventRow } from "@/lib/db"

type Props = {
  initial?: Partial<EventRow>
  onSave: (payload: Omit<EventRow, "id" | "created_at" | "updated_at">) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

function extractImagesFromHtml(html: string) {
  if (!html) return []
  const doc = new DOMParser().parseFromString(html, "text/html")
  return Array.from(doc.querySelectorAll("img"))
    .map((img) => img.getAttribute("src") ?? "")
    .filter(Boolean)
}

export default function EventEditor({ initial, onSave, onCancel, submitLabel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "")
  const [eventDate, setEventDate] = useState(initial?.event_date ?? "")
  const [contentHtml, setContentHtml] = useState(initial?.content_html ?? "")
  const [saving, setSaving] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTitle(initial?.title ?? "")
    setEventDate(initial?.event_date ?? "")
    setContentHtml(initial?.content_html ?? "")
    if (editorRef.current) {
      editorRef.current.innerHTML = initial?.content_html ?? ""
    }
  }, [initial?.id])

  const syncContent = () => {
    const html = editorRef.current?.innerHTML ?? ""
    setContentHtml(html)
  }

  const exec = (command: string, value?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    syncContent()
  }

  const handleLink = () => {
    const url = window.prompt("Enter link URL")
    if (!url) return
    exec("createLink", url)
  }

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const src = String(reader.result || "")
      if (!src) return
      exec("insertImage", src)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    const html = editorRef.current?.innerHTML ?? ""
    const images = extractImagesFromHtml(html)
    setSaving(true)
    await onSave({
      title: title.trim(),
      content_html: html,
      images,
      event_date: eventDate ? eventDate : null,
      created_by_user_id: initial?.created_by_user_id ?? null,
    })
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
          Event title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Spring recital showcase"
            className="h-11 rounded-xl border border-border bg-card px-4 text-base"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
          Event date (optional)
          <input
            type="date"
            value={eventDate ?? ""}
            onChange={(e) => setEventDate(e.target.value)}
            className="h-11 rounded-xl border border-border bg-card px-4 text-base"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
          <button type="button" onClick={() => exec("bold")} className="editor-toolbar-button">
            <Bold size={14} />
          </button>
          <button type="button" onClick={() => exec("italic")} className="editor-toolbar-button">
            <Italic size={14} />
          </button>
          <button type="button" onClick={() => exec("underline")} className="editor-toolbar-button">
            <Underline size={14} />
          </button>
          <div className="h-5 w-px bg-border mx-1" />
          <button type="button" onClick={() => exec("formatBlock", "h2")} className="editor-toolbar-button">
            <Heading2 size={14} />
          </button>
          <button type="button" onClick={() => exec("formatBlock", "h3")} className="editor-toolbar-button">
            <Heading3 size={14} />
          </button>
          <button type="button" onClick={() => exec("formatBlock", "blockquote")} className="editor-toolbar-button">
            <Quote size={14} />
          </button>
          <div className="h-5 w-px bg-border mx-1" />
          <button type="button" onClick={() => exec("insertUnorderedList")} className="editor-toolbar-button">
            <List size={14} />
          </button>
          <button type="button" onClick={() => exec("insertOrderedList")} className="editor-toolbar-button">
            <ListOrdered size={14} />
          </button>
          <button type="button" onClick={handleLink} className="editor-toolbar-button">
            <Link2 size={14} />
          </button>
          <label className="editor-toolbar-button cursor-pointer">
            <ImagePlus size={14} />
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file)
                e.currentTarget.value = ""
              }}
            />
          </label>
        </div>

        <div
          ref={editorRef}
          className="event-editor min-h-[280px] px-5 py-4 text-base text-foreground"
          contentEditable
          suppressContentEditableWarning
          onInput={syncContent}
          data-placeholder="Write the event story, add details, and sprinkle in images."
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Tip: You can paste images directly into the editor.</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !title.trim() || !(contentHtml || editorRef.current?.innerHTML)}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : submitLabel ?? "Save event"}
          </button>
        </div>
      </div>
    </div>
  )
}
