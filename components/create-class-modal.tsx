"use client"

import { useEffect, useState } from "react"
import type { ClassRow } from "@/lib/db"
import { X, Plus, Calendar, Laptop } from "lucide-react"
import {
  CLASS_COLOR_OPTIONS,
  CLASS_DETAILS_BACKGROUND_COLOR_OPTIONS,
  CLASS_SLOT_COLOR_OPTIONS,
  DEFAULT_CLASS_COLOR,
  DEFAULT_CLASS_DETAILS_BACKGROUND_COLOR,
  DEFAULT_CLASS_SLOT_COLOR,
  normalizeClassColor,
  normalizeClassDetailsBackgroundColor,
  normalizeClassSlotColor,
} from "@/lib/class-colors"
import type { TranslationDictionary } from "@/lib/i18n"
import type { StudentOption } from "@/hooks/use-students"
import {
  SCHEDULE_PERIODS,
  findSchedulePeriodByStart,
  getDefaultSchedulePeriod,
  getSchedulePeriodLabel,
  getScheduleTimes,
  isValidSchedulePeriod,
} from "@/lib/schedule-periods"

type Props = {
  date: string   // YYYY-MM-DD pre-filled
  language: string
  t: TranslationDictionary
  students: StudentOption[]
  initialStartTime?: string
  initialEndTime?: string
  onCreate: (payload: Omit<ClassRow, "id" | "created_at" | "updated_at">) => Promise<ClassRow>
  onClose: () => void
  [key: string]: any
}
const DEFAULT_LANGUAGE = "Deutsch"
// Note: language and teacher are now auto-set and not shown in the form

function normalizeDateInput(value: string) {
  const match = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (!match) return ""

  const [, year, month, day] = match
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

// The grid only passes a start time, so the end time comes from the matching period.
function resolveInitialTimes(startTime?: string) {
  const period = startTime ? findSchedulePeriodByStart(startTime) : null
  return period ?? getScheduleTimes(getDefaultSchedulePeriod().period)!
}

export default function CreateClassModal({ date, initialStartTime, onCreate, onClose, t, students }: Props) {
  const normalizedDate = normalizeDateInput(date)
  const initialTimes = resolveInitialTimes(initialStartTime)
  const hasStudents = students.length > 0
  const [form, setForm] = useState({
    title: students[0]?.nickname ?? "",
    student_user_id: students[0]?.id ?? 0,
    color: DEFAULT_CLASS_COLOR,
    details_background_color: DEFAULT_CLASS_DETAILS_BACKGROUND_COLOR,
    slot_color: DEFAULT_CLASS_SLOT_COLOR,
    date: normalizedDate,
    start_time: initialTimes.start,
    end_time: initialTimes.end,
    lesson_notes: "",
    homework: "",
    online: false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // Mirrors how the class is drawn in the calendar grid and the details panel
  const ColorPreview = ({ title, color, detailsBgColor, slotColor, online }: {
    title: string
    color: string
    detailsBgColor: string
    slotColor: string
    online: boolean
  }) => (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <div className="mb-1.5 flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar size={12} />
          {t.calendarSlotColor}
        </div>
        <div className="relative min-h-[60px] border border-border p-1" style={{ backgroundColor: slotColor }}>
          <div
            className="rounded border-l-[3px] px-1.5 py-1 text-xs font-medium leading-snug shadow-[0_1px_1px_rgb(0_0_0/0.06)]"
            style={{ backgroundColor: detailsBgColor, borderLeftColor: color, color }}
          >
            <span className="flex min-w-0 items-center gap-1">
              {online && <Laptop size={12} className="shrink-0 opacity-80" />}
              <span className="truncate">{title}</span>
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-1.5 text-xs text-muted-foreground">{t.detailsBackground}</div>
        <div className="min-h-[60px] rounded-md border border-border p-2 text-xs" style={{ backgroundColor: detailsBgColor }}>
          <div className="font-semibold" style={{ color }}>{title}</div>
          <div className="mt-0.5 text-gray-600">{getSchedulePeriodLabel(form.start_time, form.end_time)}</div>
        </div>
      </div>
    </div>
  )

  useEffect(() => {
    setForm((current) => ({
      ...current,
      title: students.find((student) => student.id === current.student_user_id)?.nickname ?? current.title,
      student_user_id: current.student_user_id || students[0]?.id || 0,
      date: normalizedDate,
    }))
  }, [normalizedDate, students])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasStudents) { setError(t.noStudentAccounts); return }
    if (!form.student_user_id) { setError(t.classTitleRequired); return }
    const safeDate = normalizeDateInput(form.date)
    if (!safeDate) { setError(t.chooseValidDate); return }
    if (!isValidSchedulePeriod(form.start_time, form.end_time)) {
      setError("Моля, избери един от наличните часове.")
      return
    }
    setSaving(true)
    setError("")
    try {
      await onCreate({
        title: students.find((student) => student.id === form.student_user_id)?.nickname ?? "",
        student_user_id: form.student_user_id,
        language: DEFAULT_LANGUAGE,
        teacher: "Rosi Vaseva",
        date: safeDate,
        start_time: form.start_time,
        end_time: form.end_time,
        color: normalizeClassColor(form.color),
        details_background_color: normalizeClassDetailsBackgroundColor(form.details_background_color),
        slot_color: normalizeClassSlotColor(form.slot_color),
        online: form.online,
        homework: form.homework,
        lesson_notes: form.lesson_notes,
      })
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : t.createFailed)
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <form
        className="relative w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-primary">
          <div className="flex items-center gap-2">
            <Plus size={18} className="text-primary-foreground" />
            <h2 className="text-base font-bold text-primary-foreground">{t.newClassTitle}</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10 transition">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 overflow-y-auto flex-1">
          {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}

          {!hasStudents && (
            <p className="text-sm text-muted-foreground bg-secondary rounded-lg px-3 py-2">
              {t.noStudentAccounts}
            </p>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.studentName}</label>
            <select
              required
              value={form.student_user_id || ""}
              onChange={(e) => {
                const selectedId = Number(e.target.value)
                const selectedStudent = students.find((student) => student.id === selectedId)
                setForm({
                  ...form,
                  student_user_id: selectedId,
                  title: selectedStudent?.nickname ?? "",
                })
              }}
              className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="" disabled>{t.studentPlaceholder}</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.nickname}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.date}</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.startTime}</label>
              <select
                value={getSchedulePeriodLabel(form.start_time, form.end_time)}
                onChange={(e) => {
                  const times = getScheduleTimes(e.target.value)
                  if (!times) return
                  setForm((current) => ({ ...current, start_time: times.start, end_time: times.end }))
                }}
                className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="" disabled>—</option>
                {SCHEDULE_PERIODS.map((period) => (
                  <option key={period.period} value={period.period}>
                    {period.period}
                  </option>
                ))}
              </select>
            </div>
 
            <div className="flex flex-col gap-1 col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.onlineOrInPerson}</span>
              <div className="flex items-center gap-5 text-sm text-foreground">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    value="in-person"
                    checked={!form.online}
                    onChange={() => setForm((current) => ({ ...current, online: false }))}
                    className="shadow-none"
                  />
                  {t.inPerson}
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="mode"
                    value="online"
                    checked={form.online}
                    onChange={() => setForm((current) => ({ ...current, online: true }))}
                    className="shadow-none"
                  />
                  {t.online}
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.calendarColor}</label>
            <div className="flex flex-wrap gap-2">
              {CLASS_COLOR_OPTIONS.map((option) => {
                const selected = form.color.toLowerCase() === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, color: option.value }))}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      selected ? "border-foreground bg-secondary text-foreground" : "border-border bg-background text-muted-foreground hover:border-foreground/40"
                    }`}
                  >
                    <span
                      className="size-3 rounded-full border border-black/10"
                      style={{ backgroundColor: option.value }}
                    />
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.detailsBackground}</label>
            <div className="flex flex-wrap gap-2">
              {CLASS_DETAILS_BACKGROUND_COLOR_OPTIONS.map((option) => {
                const selected = form.details_background_color.toLowerCase() === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, details_background_color: option.value }))}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      selected ? "border-foreground bg-secondary text-foreground" : "border-border bg-background text-muted-foreground hover:border-foreground/40"
                    }`}
                  >
                    <span
                      className="size-3 rounded-full border border-black/10"
                      style={{ backgroundColor: option.value }}
                    />
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.calendarSlotColor}</label>
            <div className="flex flex-wrap gap-2">
              {CLASS_SLOT_COLOR_OPTIONS.map((option) => {
                const selected = form.slot_color.toLowerCase() === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, slot_color: option.value }))}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      selected ? "border-foreground bg-secondary text-foreground" : "border-border bg-background text-muted-foreground hover:border-foreground/40"
                    }`}
                  >
                    <span
                      className="size-3 rounded-full border border-black/10"
                      style={{ backgroundColor: option.value }}
                    />
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Combined Color Preview */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
          <ColorPreview 
            title={students.find(s => s.id === form.student_user_id)?.nickname || "Урок"}
            color={normalizeClassColor(form.color)}
            detailsBgColor={normalizeClassDetailsBackgroundColor(form.details_background_color)}
            slotColor={normalizeClassSlotColor(form.slot_color)}
            online={form.online}
          />
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-border flex justify-end gap-2">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg text-foreground bg-secondary hover:bg-muted transition">
            {t.cancel}
          </button>
          <button type="submit" disabled={saving || !hasStudents}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-60">
            {saving ? t.creating : t.createClass}
          </button>
        </div>
      </form>
    </div>
  )
}
