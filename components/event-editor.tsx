"use client"

import { useEffect, useRef, useState } from "react"
import { Bold, Italic, Underline, ImagePlus, X } from "lucide-react"
import type { EventRow } from "@/lib/db"
import { EVENT_CATEGORIES, getEventCategoryLabel, normalizeEventCategory } from "@/lib/event-categories"
import { translations } from "@/lib/i18n"
import { useLanguage } from "@/hooks/use-language"

type Props = {
  initial?: Partial<EventRow>
  onSave: (payload: Omit<EventRow, "id" | "created_at" | "updated_at">) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

const MAX_IMAGE_SIDE = 1600

// Shrinks a photo to at most MAX_IMAGE_SIDE px and re-encodes it as JPEG, so
// phone photos (often 4+ MB) are stored at a few hundred KB.
async function readImageAsDataUrl(file: File) {
  const original = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ""))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
  if (file.type === "image/gif" || file.type === "image/svg+xml") return original

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
    const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const context = canvas.getContext("2d")
    if (!context) return original
    context.fillStyle = "#fff"
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const resized = canvas.toDataURL("image/jpeg", 0.82)
    return resized.length < original.length ? resized : original
  } catch {
    return original
  }
}

function extractImagesFromHtml(html: string) {
  if (!html) return []
  const doc = new DOMParser().parseFromString(html, "text/html")
  return Array.from(doc.querySelectorAll("img"))
    .map((img) => img.getAttribute("src") ?? "")
    .filter(Boolean)
}

export default function EventEditor({ initial, onSave, onCancel, submitLabel }: Props) {
  const { language } = useLanguage()
  const t = translations[language]
  const [title, setTitle] = useState(initial?.title ?? "")
  const [category, setCategory] = useState(normalizeEventCategory(initial?.category))
  const [eventDate, setEventDate] = useState(initial?.event_date ?? "")
  const [contentHtml, setContentHtml] = useState(initial?.content_html ?? "")
  const [mediaFiles, setMediaFiles] = useState<string[]>(initial?.images ?? [])
  const [saving, setSaving] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTitle(initial?.title ?? "")
    setCategory(normalizeEventCategory(initial?.category))
    setEventDate(initial?.event_date ?? "")
    setContentHtml(initial?.content_html ?? "")
    setMediaFiles(initial?.images ?? [])
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

  const handleImageUpload = async (file: File) => {
    const src = await readImageAsDataUrl(file)
    if (src) setMediaFiles(prev => [...prev, src])
  }

  const handleFileUpload = async (file: File) => {
    if (file.type.startsWith("image/")) return handleImageUpload(file)
    const reader = new FileReader()
    reader.onload = () => {
      const src = String(reader.result || "")
      if (!src) return
      setMediaFiles(prev => [...prev, src])
    }
    reader.readAsDataURL(file)
  }

  const removeMediaFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    const html = editorRef.current?.innerHTML ?? ""
    setSaving(true)
    try {
      await onSave({
        title: title.trim(),
        category,
        content_html: html,
        images: mediaFiles,
        event_date: eventDate ? eventDate : null,
        created_by_user_id: initial?.created_by_user_id ?? null,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
          {t.eventCategory}
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as typeof category)}
            className="h-11 rounded-xl border border-border bg-card px-4 text-base"
          >
            {EVENT_CATEGORIES.map(({ value }) => (
              <option key={value} value={value}>
                {getEventCategoryLabel(value, t)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
          {t.eventDateOptional}
          <input
            type="date"
            value={eventDate ?? ""}
            onChange={(e) => setEventDate(e.target.value)}
            className="h-11 rounded-xl border border-border bg-card px-4 text-base"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
          {t.eventTitle}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.eventTitle}
            className="h-11 rounded-xl border border-border bg-card px-4 text-base"
          />
        </label>
        <div className="flex items-end">
          <p className="text-xs text-muted-foreground">{t.eventChooseCategory}</p>
        </div>
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
        </div>

        <div
          ref={editorRef}
          className="event-editor min-h-[280px] px-5 py-4 text-base text-foreground"
          contentEditable
          suppressContentEditableWarning
          onInput={syncContent}
          data-placeholder={t.eventUploadMedia}
        />
      </div>

      {/* Media Section - Separate from Text */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ImagePlus size={16} />
            {t.eventMediaTitle}
          </h3>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition">
                <ImagePlus size={16} />
                <span className="text-sm font-medium">{t.eventAddPhotos}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    files.forEach(file => handleImageUpload(file))
                    e.currentTarget.value = ""
                  }}
                />
              </label>
              <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition">
                <span className="text-sm font-medium">{t.eventAddFiles}</span>
                <input
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    files.forEach(file => handleFileUpload(file))
                    e.currentTarget.value = ""
                  }}
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Качи снимки и файлове към публикацията. Снимките се смаляват автоматично преди качване.
            </p>
          </div>

          {mediaFiles.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {mediaFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg border border-border overflow-hidden bg-muted">
                    {file.startsWith('data:image') ? (
                      <img 
                        src={file} 
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center p-2">
                          <div className="text-2xl mb-1">📄</div>
                          <div className="text-xs text-muted-foreground truncate">File {index + 1}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMediaFile(index)}
                    aria-label="Премахни"
                    className="absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{t.eventUploadMedia}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !title.trim() || !(contentHtml || editorRef.current?.innerHTML)}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {saving ? t.saving : submitLabel ?? t.eventPublish}
          </button>
        </div>
      </div>
    </div>
  )
}
