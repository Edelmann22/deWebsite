"use client"

import { useEffect, useState } from "react"
import type { ClassRow } from "@/lib/db"
import { X, Plus, Calendar } from "lucide-react"
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
const DEFAULT_TEACHER = "Rosi Vaseva"

function normalizeDateInput(value: string) {
  const match = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
  if (!match) return ""

  const [, year, month, day] = match
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

export default function CreateClassModal({ date, initialStartTime, initialEndTime, onCreate, onClose, t, students }: Props) {
  const normalizedDate = normalizeDateInput(date)
  const hasStudents = students.length > 0
  const [form, setForm] = useState({
    title: students[0]?.nickname ?? "",
    student_user_id: students[0]?.id ?? 0,
    language: DEFAULT_LANGUAGE,
    teacher: DEFAULT_TEACHER,
    color: DEFAULT_CLASS_COLOR,
    details_background_color: DEFAULT_CLASS_DETAILS_BACKGROUND_COLOR,
    slot_color: DEFAULT_CLASS_SLOT_COLOR,
    date: normalizedDate,
    start_time: initialStartTime ?? "09:00",
    end_time: initialEndTime ?? "10:00",
    lesson_notes: "",
    homework: "",
    online: false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // Color preview component
  const ColorPreview = ({ title, bgColor, detailsBgColor, slotColor }: { 
    title: string; 
    bgColor: string; 
    detailsBgColor: string; 
    slotColor: string; 
  }) => (
    <div className="mt-2 p-3 rounded-lg border border-gray-200 bg-gray-50">
      <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
        <Calendar size={12} />
        Calendar Preview
      </div>
      
      {/* Main calendar item */}
      <div 
        className="p-2 rounded-md text-white text-xs font-medium text-center mb-2"
        style={{ backgroundColor: bgColor }}
      >
        <div className="mb-1">{title}</div>
        <div 
          className="inline-block px-2 py-1 rounded text-xs"
          style={{ backgroundColor: slotColor }}
        >
          Time Slot
        </div>
      </div>
      
      {/* Details panel preview */}
      <div className="text-xs text-gray-600 mb-1">Details Panel:</div>
      <div 
        className="p-2 rounded text-xs"
        style={{ backgroundColor: detailsBgColor }}
      >
        <div className="font-medium mb-1" style={{ color: '#1f2937' }}>Lesson Details</div>
        <div style={{ color: '#4b5563' }}>Notes and homework info...</div>
      </div>
    </div>
  )

  useEffect(() => {
    setForm((current) => ({
      ...current,
      title: students.find((student) => student.id === current.student_user_id)?.nickname ?? current.title,
      student_user_id: current.student_user_id || students[0]?.id || 0,
      date: normalizedDate,
      start_time: initialStartTime ?? current.start_time,
      end_time: initialEndTime ?? current.end_time,
    }))
  }, [normalizedDate, initialStartTime, initialEndTime, students])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasStudents) { setError(t.noStudentAccounts); return }
    if (!form.student_user_id) { setError(t.classTitleRequired); return }
    const safeDate = normalizeDateInput(form.date)
    if (!safeDate) { setError(t.chooseValidDate); return }
    setSaving(true)
    setError("")
    try {
      await onCreate({
        ...form,
        title: students.find((student) => student.id === form.student_user_id)?.nickname ?? "",
        date: safeDate,
        color: normalizeClassColor(form.color),
        details_background_color: normalizeClassDetailsBackgroundColor(form.details_background_color),
        slot_color: normalizeClassSlotColor(form.slot_color),
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
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.startTime}</label>
              <input
                type="time"
                step={900}
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring [appearance:textfield] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                pattern="[0-9]{2}:[0-9]{2}"
                min="06:00"
                max="22:00"
                required
                data-time-format="24h"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.endTime}</label>
              <input
                type="time"
                step={900}
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring [appearance:textfield] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                pattern="[0-9]{2}:[0-9]{2}"
                min="06:00"
                max="22:00"
                required
                data-time-format="24h"
              />
            </div>
 
            <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.onlineOrInPerson}</label>
                <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.online}</label>
                    <input 
                        type="radio"
                        name="mode"
                        value="online"
                        onChange={() => setForm({ ...form, online: true })}
                    />
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.inPerson}</label>
                    <input 
                        type="radio"
                        name="mode"
                        value="in-person"
                        onChange={() => setForm({ ...form, online: false })}
                    />
                </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.calendarColor}</label>
            <div className="flex flex-wrap gap-2">
              {CLASS_COLOR_OPTIONS.map((option) => {
                const selected = form.color === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm({ ...form, color: option.value })}
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
                const selected = form.details_background_color === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm({ ...form, details_background_color: option.value })}
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
                const selected = form.slot_color === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm({ ...form, slot_color: option.value })}
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
            title={students.find(s => s.id === form.student_user_id)?.nickname || "Lesson"} 
            bgColor={form.color} 
            detailsBgColor={form.details_background_color}
            slotColor={form.slot_color}
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
