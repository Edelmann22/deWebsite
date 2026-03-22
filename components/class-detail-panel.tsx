"use client"

import { useState } from "react"
import type { ClassRow } from "@/lib/db"
import AutoTextarea from "./auto-textarea"
import {
  CLASS_COLOR_OPTIONS,
  CLASS_DETAILS_BACKGROUND_COLOR_OPTIONS,
  CLASS_SLOT_COLOR_OPTIONS,
  normalizeClassColor,
  normalizeClassDetailsBackgroundColor,
  normalizeClassSlotColor,
} from "@/lib/class-colors"
import {
  X,
  Pencil,
  Trash2,
  Clock,
  BookOpen,
  ClipboardList,
  Check,
  CalendarDays,
  Languages,
  UserRound,
  Sparkles,
  AlertTriangle,
} from "lucide-react"
import type { TranslationDictionary } from "@/lib/i18n"
import type { StudentOption } from "@/hooks/use-students"

type Props = {
  cls: ClassRow
  locale: string
  t: TranslationDictionary
  students: StudentOption[]
  canEdit: boolean
  onClose: () => void
  onUpdate: (id: number, payload: Partial<ClassRow>) => Promise<ClassRow>
  onDelete: (id: number) => Promise<void>
}

function formatTime(t: string) {
  const [hours, minutes] = t.split(":")
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

function formatDate(d: string, locale: string) {
  return new Date(d + "T12:00:00").toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function ClassDetailPanel({ cls, locale, t, students, canEdit, onClose, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const [draft, setDraft] = useState({
    title: cls.title,
    student_user_id: cls.student_user_id,
    language: cls.language,
    teacher: cls.teacher,
    color: normalizeClassColor(cls.color),
    details_background_color: normalizeClassDetailsBackgroundColor(cls.details_background_color),
    slot_color: normalizeClassSlotColor(cls.slot_color),
    date: cls.date,
    start_time: cls.start_time,
    end_time: cls.end_time,
    lesson_notes: cls.lesson_notes,
    homework: cls.homework,
  })

  const selectedStudentName =
    students.find((student) => student.id === draft.student_user_id)?.nickname ??
    draft.title

  const current = editing ? { ...draft, title: selectedStudentName } : cls
  const detailsBackground = normalizeClassDetailsBackgroundColor(current.details_background_color)

  const resetDraft = () => {
    setDraft({
      title: cls.title,
      student_user_id: cls.student_user_id,
      language: cls.language,
      teacher: cls.teacher,
      color: normalizeClassColor(cls.color),
      details_background_color: normalizeClassDetailsBackgroundColor(cls.details_background_color),
      slot_color: normalizeClassSlotColor(cls.slot_color),
      date: cls.date,
      start_time: cls.start_time,
      end_time: cls.end_time,
      lesson_notes: cls.lesson_notes,
      homework: cls.homework,
    })
    setEditing(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await onUpdate(cls.id, {
      ...draft,
      title: selectedStudentName,
    })
    setSaving(false)         
    setEditing(false)
  }

  const handleDelete = async () => {
    await onDelete(cls.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        className="relative flex max-h-[85vh] sm:max-h-[90vh] w-full max-w-3xl flex-col overflow-y-auto rounded-[2rem] sm:rounded-[2.5rem] border border-white/50 bg-card shadow-[0_30px_80px_rgba(70,50,20,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 z-10 overflow-hidden rounded-t-[2rem] sm:rounded-t-[2.5rem] border-b border-border/70 backdrop-blur-xl"
          style={{ backgroundColor: detailsBackground }}
        >
          <div
            className="absolute inset-x-0 top-0 h-20 sm:h-28"
            style={{
              backgroundImage: `radial-gradient(circle at top left, ${normalizeClassColor(current.color)}33, transparent 50%), radial-gradient(circle at top right, rgba(255,255,255,0.65), transparent 45%)`,
            }}
          />
          <div className="relative flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 pb-3 sm:pb-5 sm:flex-row sm:items-start">
            {/* Close Button - Top Right */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-lg bg-white/90 border border-gray-300 p-2.5 text-gray-600 shadow-lg transition hover:bg-white hover:text-gray-900 hover:shadow-xl z-30"
              aria-label="Close class details"
            >
              <X size={20} />
            </button>
            
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/15 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm">
                  <Sparkles size={12} />
                  {t.classDetails}
                </span>
                <span className="inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent-foreground">
                  {formatDate(current.date, locale)}
                </span>
              </div>
              {editing && canEdit ? (
                <select
                  value={draft.student_user_id ?? ""}
                  onChange={(e) => {
                    const studentId = Number(e.target.value)
                    const student = students.find((item) => item.id === studentId)
                    setDraft((prev) => ({
                      ...prev,
                      student_user_id: studentId,
                      title: student?.nickname ?? prev.title,
                    }))
                  }}
                  className="w-full border-b-2 border-primary/60 bg-transparent pb-2 text-2xl font-bold text-foreground focus:outline-none"
                >
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.nickname}
                    </option>
                  ))}
                </select>
              ) : (
                <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance">{current.title}</h2>
              )}
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {t.detailsIntro}
              </p>
            </div>
            
            {/* Button for closing the panel */}
            <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
              <button
                onClick={onClose}
                className="rounded-xl border border-border/70 bg-card/90 p-2 text-muted-foreground shadow-sm transition hover:bg-white hover:text-foreground"
                aria-label="Close details"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="relative px-4 sm:px-6 pb-4 sm:pb-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/70 bg-white/70 p-3 sm:p-4 shadow-sm">
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <Languages size={13} />
                  {t.language}
                </div>
                <p className="text-sm font-semibold text-foreground">{current.language || t.notSet}</p>
              </div>

              <div className="rounded-2xl border border-white/70 bg-white/70 p-3 sm:p-4 shadow-sm">
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <UserRound size={13} />
                  {t.teacher}
                </div>
                <p className="text-sm font-semibold text-foreground">{current.teacher || t.notAssigned}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Selection Section - Central */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-5">
          <div className="rounded-2xl border border-white/70 bg-white/75 p-4 sm:p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              <UserRound size={14} className="text-primary" />
              Student
            </div>
            {editing && canEdit ? (
              <select
                value={draft.student_user_id ?? ""}
                onChange={(e) => {
                  const studentId = Number(e.target.value)
                  const student = students.find((item) => item.id === studentId)
                  setDraft((prev) => ({
                    ...prev,
                    student_user_id: studentId,
                    title: student?.nickname ?? prev.title,
                  }))
                }}
                className="w-full rounded-xl border border-border bg-background/90 px-3 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.nickname}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserRound size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">{current.title}</p>
                  <p className="text-sm text-muted-foreground">Current Student</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-border/70 px-4 sm:px-6 py-3 sm:py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays size={15} className="text-primary" />
            {editing && canEdit ? (
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                className="rounded-xl border border-border bg-background/90 px-2 py-1.5 text-xs text-foreground"
              />
            ) : (
              <span>{formatDate(current.date, locale)}</span>
            )}
          </div>

          {/* Time Editing - Next to Date */}
          <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <Clock size={15} className="text-blue-600" />
            {editing && canEdit ? (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  step={900}
                  value={draft.start_time}
                  onChange={(e) => setDraft({ ...draft, start_time: e.target.value })}
                  className="rounded-xl border-2 border-blue-300 bg-blue-50/50 px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  pattern="[0-9]{2}:[0-9]{2}"
                  min="06:00"
                  max="22:00"
                  required
                  data-time-format="24h"
                />
                <span className="text-blue-600">-</span>
                <input
                  type="time"
                  step={900}
                  value={draft.end_time}
                  onChange={(e) => setDraft({ ...draft, end_time: e.target.value })}
                  className="rounded-xl border-2 border-blue-300 bg-blue-50/50 px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  pattern="[0-9]{2}:[0-9]{2}"
                  min="06:00"
                  max="22:00"
                  required
                  data-time-format="24h"
                />
              </div>
            ) : (
              <span className="text-blue-600">{formatTime(current.start_time)} - {formatTime(current.end_time)}</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {canEdit && editing ? (
              <>
                <button
                  onClick={resetDraft}
                  className="px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-secondary"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-60"
                >
                  <Check size={14} /> {saving ? t.saving : t.save}
                </button>
              </>
            ) : canEdit ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition hover:bg-brand-light"
              >
                <Pencil size={14} /> {t.edit}
              </button>
            ) : null}
            {canEdit && confirmDelete ? (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition hover:opacity-90"
              >
                <Trash2 size={14} /> {t.confirm}
              </button>
            ) : canEdit ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="rounded-xl p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 size={16} />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5 bg-[linear-gradient(180deg,rgba(255,255,255,0.35),transparent_30%)] px-4 sm:px-6 py-4 sm:py-6">
          {canEdit && confirmDelete && (
            <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/8 px-3 sm:px-4 py-3 text-sm text-foreground">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-destructive" />
              <div>
                <p className="font-semibold">{t.deleteClassQuestion}</p>
                <p className="text-muted-foreground">{t.deleteClassWarning}</p>
              </div>
            </div>
          )}

          <section className="rounded-[1.5rem] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              <BookOpen size={14} className="text-primary" />
              {t.lessonNotes}
            </h3>
            {editing && canEdit ? (
              <AutoTextarea
                value={draft.lesson_notes}
                onChange={(v) => setDraft({ ...draft, lesson_notes: v })}
                placeholder={t.lessonNotesPlaceholder}
                minRows={4}
                className="rounded-2xl border-white bg-background/80"
              />
            ) : (
              <div className="min-h-[112px] rounded-2xl bg-secondary/65 p-4 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {current.lesson_notes || <span className="italic text-muted-foreground">{t.noLessonNotes}</span>}
              </div>
            )}
          </section>

          <section className="rounded-[1.5rem] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              <ClipboardList size={14} className="text-accent-foreground" style={{ color: "var(--accent)" }} />
              {t.homework}
            </h3>
            {editing && canEdit ? (
              <AutoTextarea
                value={draft.homework}
                onChange={(v) => setDraft({ ...draft, homework: v })}
                placeholder={t.homeworkPlaceholder}
                minRows={3}
                className="rounded-2xl border-white bg-background/80"
              />
            ) : (
              <div className="min-h-[96px] rounded-2xl bg-secondary/65 p-4 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {current.homework || <span className="italic text-muted-foreground">{t.noHomework}</span>}
              </div>
            )}
          </section>

          <div className="grid gap-4 lg:grid-cols-3">
            <section className="rounded-[1.5rem] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                {t.calendarColor}
              </h3>
              {editing && canEdit ? (
                <div className="flex flex-wrap gap-2">
                  {CLASS_COLOR_OPTIONS.map((option) => {
                    const selected = draft.color === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setDraft({ ...draft, color: option.value })}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                          selected ? "border-foreground bg-secondary text-foreground" : "border-border bg-background text-muted-foreground hover:border-foreground/40"
                        }`}
                      >
                        <span className="size-3 rounded-full border border-black/10" style={{ backgroundColor: option.value }} />
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary/65 px-3 py-2 text-sm font-medium text-foreground">
                  <span className="size-3 rounded-full border border-black/10" style={{ backgroundColor: normalizeClassColor(current.color) }} />
                  {CLASS_COLOR_OPTIONS.find((option) => option.value === normalizeClassColor(current.color))?.label ?? "Custom"}
                </div>
              )}
            </section>

            <section className="rounded-[1.5rem] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                {t.detailsBackground}
              </h3>
              {editing && canEdit ? (
                <div className="flex flex-wrap gap-2">
                  {CLASS_DETAILS_BACKGROUND_COLOR_OPTIONS.map((option) => {
                    const selected = draft.details_background_color === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setDraft({ ...draft, details_background_color: option.value })}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                          selected ? "border-foreground bg-secondary text-foreground" : "border-border bg-background text-muted-foreground hover:border-foreground/40"
                        }`}
                      >
                        <span className="size-3 rounded-full border border-black/10" style={{ backgroundColor: option.value }} />
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary/65 px-3 py-2 text-sm font-medium text-foreground">
                  <span className="size-3 rounded-full border border-black/10" style={{ backgroundColor: normalizeClassDetailsBackgroundColor(current.details_background_color) }} />
                  {CLASS_DETAILS_BACKGROUND_COLOR_OPTIONS.find((option) => option.value === normalizeClassDetailsBackgroundColor(current.details_background_color))?.label ?? "Custom"}
                </div>
              )}
            </section>

            <section className="rounded-[1.5rem] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                {t.calendarSlotColor}
              </h3>
              {editing && canEdit ? (
                <div className="flex flex-wrap gap-2">
                  {CLASS_SLOT_COLOR_OPTIONS.map((option) => {
                    const selected = draft.slot_color === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setDraft({ ...draft, slot_color: option.value })}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                          selected ? "border-foreground bg-secondary text-foreground" : "border-border bg-background text-muted-foreground hover:border-foreground/40"
                        }`}
                      >
                        <span className="size-3 rounded-full border border-black/10" style={{ backgroundColor: option.value }} />
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary/65 px-3 py-2 text-sm font-medium text-foreground">
                  <span className="size-3 rounded-full border border-black/10" style={{ backgroundColor: normalizeClassSlotColor(current.slot_color) }} />
                  {CLASS_SLOT_COLOR_OPTIONS.find((option) => option.value === normalizeClassSlotColor(current.slot_color))?.label ?? "Custom"}
                </div>
              )}
            </section>
          </div>

          {/* Close Button - Bottom */}
          <div className="px-4 sm:px-6 py-4 border-t border-border/70">
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition flex items-center justify-center gap-2"
            >
              <X size={16} />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
