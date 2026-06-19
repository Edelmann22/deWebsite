"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import {
  CLASS_COLOR_OPTIONS,
  CLASS_DETAILS_BACKGROUND_COLOR_OPTIONS,
  CLASS_SLOT_COLOR_OPTIONS,
  DEFAULT_CLASS_COLOR,
  DEFAULT_CLASS_DETAILS_BACKGROUND_COLOR,
  DEFAULT_CLASS_SLOT_COLOR,
} from "@/lib/class-colors"

type StudentOption = { id: number; nickname: string }

export type DefaultWeekLessonDraft = {
  day_of_week: number
  start_time: string
  end_time: string
  student_user_id: number
  language: string
  teacher: string
  color: string
  details_background_color: string
  slot_color: string
  online: boolean
}

const WEEKDAYS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
] as const

function withDefaults(value: DefaultWeekLessonDraft): DefaultWeekLessonDraft {
  return {
    day_of_week: value.day_of_week ?? 1,
    start_time: value.start_time ?? "10:00",
    end_time: value.end_time ?? "12:00",
    student_user_id: value.student_user_id ?? 0,
    language: value.language ?? "Deutsch",
    teacher: value.teacher ?? "Rosi Vaseva",
    color: value.color ?? DEFAULT_CLASS_COLOR,
    details_background_color: value.details_background_color ?? DEFAULT_CLASS_DETAILS_BACKGROUND_COLOR,
    slot_color: value.slot_color ?? DEFAULT_CLASS_SLOT_COLOR,
    online: Boolean(value.online),
  }
}

type Props = {
  open: boolean
  title: string
  students: StudentOption[]
  initial: DefaultWeekLessonDraft
  submitLabel: string
  onSave: (draft: DefaultWeekLessonDraft) => void
  onDelete?: () => void
  onClose: () => void
}

export default function DefaultWeekLessonModal({
  open,
  title,
  students,
  initial,
  submitLabel,
  onSave,
  onDelete,
  onClose,
}: Props) {
  const [form, setForm] = useState<DefaultWeekLessonDraft>(() => withDefaults(initial))

  useEffect(() => {
    setForm(withDefaults(initial))
  }, [initial])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <form
        className="relative w-full max-w-xl max-h-[90vh] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-primary">
          <h2 className="text-base font-bold text-primary-foreground">{title}</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10 transition">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
              Day
              <select
                value={form.day_of_week}
                onChange={(e) => setForm((prev) => ({ ...prev, day_of_week: Number(e.target.value) }))}
                className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
              >
                {WEEKDAYS.map((day) => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
              Start time
              <input
                type="time"
                step={900}
                value={form.start_time}
                onChange={(e) => setForm((prev) => ({ ...prev, start_time: e.target.value }))}
                className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
              End time
              <input
                type="time"
                step={900}
                value={form.end_time}
                onChange={(e) => setForm((prev) => ({ ...prev, end_time: e.target.value }))}
                className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-foreground md:col-span-2">
              Student
              <select
                value={form.student_user_id || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, student_user_id: Number(e.target.value) }))}
                className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
              >
                <option value="" disabled>Select student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>{student.nickname}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
              Online
              <input
                type="checkbox"
                checked={form.online}
                onChange={(e) => setForm((prev) => ({ ...prev, online: e.target.checked }))}
                className="size-4"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
              <span className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full border border-black/10"
                  style={{ backgroundColor: form.color }}
                />
                Font color
              </span>
              <select
                value={form.color}
                onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
                className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
              >
                {CLASS_COLOR_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
              <span className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full border border-black/10"
                  style={{ backgroundColor: form.details_background_color }}
                />
                Details background
              </span>
              <select
                value={form.details_background_color}
                onChange={(e) => setForm((prev) => ({ ...prev, details_background_color: e.target.value }))}
                className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
              >
                {CLASS_DETAILS_BACKGROUND_COLOR_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
              <span className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full border border-black/10"
                  style={{ backgroundColor: form.slot_color }}
                />
                Slot color
              </span>
              <select
                value={form.slot_color}
                onChange={(e) => setForm((prev) => ({ ...prev, slot_color: e.target.value }))}
                className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
              >
                {CLASS_SLOT_COLOR_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              {submitLabel}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Cancel
            </button>
          </div>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-xl border border-destructive/40 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
