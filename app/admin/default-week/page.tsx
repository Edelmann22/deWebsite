"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/hooks/use-session"
import { useStudents } from "@/hooks/use-students"
import {
  DEFAULT_CLASS_COLOR,
  DEFAULT_CLASS_DETAILS_BACKGROUND_COLOR,
  DEFAULT_CLASS_SLOT_COLOR,
} from "@/lib/class-colors"
import { addDays } from "@/lib/timezone"
import type { ClassRow } from "@/lib/db"
import CalendarGrid from "@/components/calendar-grid"
import { findSchedulePeriodByStart } from "@/lib/schedule-periods"
import DefaultWeekLessonModal, { type DefaultWeekLessonDraft } from "@/components/default-week-lesson-modal"

type DefaultWeekSettings = {
  timezone: string
  auto_generate: boolean
  active_until: string | null
}

type DefaultWeekLesson = {
  id: number
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

const REFERENCE_WEEK_START = "2025-01-06" // Monday

// Calculate next week's Monday (the week that doesn't include today)
// This must match the logic in lib/timezone.ts getUpcomingWeekRange
function getNextWeekMonday(timeZone: string = "UTC"): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  })
  const parts = formatter.formatToParts(new Date())
  const map: Record<string, string> = {}
  let weekdayLabel = "Mon"
  for (const part of parts) {
    if (part.type === "literal") continue
    if (part.type === "weekday") {
      weekdayLabel = part.value
      continue
    }
    map[part.type] = part.value
  }
  const WEEKDAY_TO_NUMBER: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }
  const weekday = WEEKDAY_TO_NUMBER[weekdayLabel] ?? 1
  const daysUntilNextMonday = ((8 - weekday) % 7) || 7
  
  // Use noon to avoid timezone issues with midnight
  const baseDate = new Date(`${map.year}-${map.month}-${map.day}T12:00:00`)
  baseDate.setDate(baseDate.getDate() + daysUntilNextMonday)
  return baseDate.toISOString().split('T')[0]
}

function createLessonDraft(students: { id: number; nickname: string }[]): DefaultWeekLessonDraft {
  return {
    day_of_week: 1,
    start_time: "10:00",
    end_time: "12:00",
    student_user_id: students[0]?.id ?? 0,
    language: "Deutsch",
    teacher: "Rosi Vaseva",
    color: DEFAULT_CLASS_COLOR,
    details_background_color: DEFAULT_CLASS_DETAILS_BACKGROUND_COLOR,
    slot_color: DEFAULT_CLASS_SLOT_COLOR,
    online: false,
  }
}

function addMinutesToTime(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number)
  const total = h * 60 + m + minutes
  const nextH = Math.floor((total + 24 * 60) % (24 * 60) / 60)
  const nextM = (total + 24 * 60) % 60
  return `${String(nextH).padStart(2, "0")}:${String(nextM).padStart(2, "0")}`
}

function dayOfWeekFromDate(dateStr: string, timeZone: string = "UTC") {
  const start = new Date(`${getNextWeekMonday(timeZone)}T00:00:00`)
  const date = new Date(`${dateStr}T00:00:00`)
  const diffMs = date.getTime() - start.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  return diffDays + 1
}

export default function DefaultWeekPage() {
  const router = useRouter()
  const { user, loading } = useSession()
  const { students } = useStudents(Boolean(user && user.role === "admin"))

  const [settings, setSettings] = useState<DefaultWeekSettings | null>(null)
  const [lessons, setLessons] = useState<DefaultWeekLesson[]>([])
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [savingSettings, setSavingSettings] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [lessonModalOpen, setLessonModalOpen] = useState(false)
  const [lessonModalMode, setLessonModalMode] = useState<"create" | "edit">("create")
  const [lessonModalInitial, setLessonModalInitial] = useState<DefaultWeekLessonDraft>(() => createLessonDraft(students))
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null)
  const [savingLesson, setSavingLesson] = useState(false)

  const studentLookup = useMemo(() => {
    return new Map(students.map((student) => [student.id, student.nickname]))
  }, [students])

  useEffect(() => {
    if (lessonModalMode === "create") {
      setLessonModalInitial(createLessonDraft(students))
    }
  }, [students, lessonModalMode])

  useEffect(() => {
    if (!user || user.role !== "admin") return
    let active = true
    const load = async () => {
      setError(null)
      const res = await fetch("/api/default-week", { cache: "no-store" })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        if (!active) return
        setError(data?.error ?? "Неуспешно зареждане на настройките за седмицата по подразбиране.")
        return
      }
      const data = await res.json()
      if (!active) return
      setSettings(data.settings)
      setLessons(Array.isArray(data.lessons) ? data.lessons : [])
    }
    load()
    return () => {
      active = false
    }
  }, [user])

  const handleSaveSettings = async () => {
    if (!settings) return
    setSavingSettings(true)
    setStatus(null)
    setError(null)
    const res = await fetch("/api/default-week", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? "Неуспешно запазване на настройките.")
      setSavingSettings(false)
      return
    }
    const data = await res.json()
    setSettings(data)
    setStatus("Настройките са запазени.")
    setSavingSettings(false)
  }

  const handleGenerate = async () => {
    const until = settings?.active_until || null
    const rangeStart = getNextWeekMonday(settings?.timezone ?? "UTC")
    if (until && until < rangeStart) {
      setError(`Крайната дата трябва да е на или след ${rangeStart}.`)
      return
    }
    const confirmMessage = until
      ? `Всички часове от ${rangeStart} до ${until} ще бъдат заменени със седмицата по подразбиране. Продължаване?`
      : `Всички часове в седмицата от ${rangeStart} ще бъдат заменени със седмицата по подразбиране. Продължаване?`
    if (!window.confirm(confirmMessage)) return

    setGenerating(true)
    setStatus(null)
    setError(null)
    const res = await fetch("/api/default-week/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(until ? { until } : {}),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? "Неуспешно генериране на седмицата.")
      setGenerating(false)
      return
    }
    const data = await res.json()
    setStatus(
      data.skipped
        ? `Пропуснато: ${data.reason ?? "Вече е генерирано"}`
        : data.deleted > 0
          ? `Заменени ${data.deleted} съществуващи часа с ${data.created} нови за периода ${data.weekStart} – ${data.weekEnd}.`
          : `Създадени ${data.created} часа за периода ${data.weekStart} – ${data.weekEnd}.`
    )
    setGenerating(false)
  }

  const openCreateModal = (dateStr: string, startTime: string) => {
    const timeZone = settings?.timezone ?? "UTC"
    const draft = createLessonDraft(students)
    draft.day_of_week = dayOfWeekFromDate(dateStr, timeZone)
    const period = findSchedulePeriodByStart(startTime)
    draft.start_time = period?.start ?? startTime
    draft.end_time = period?.end ?? addMinutesToTime(startTime, 90)
    setLessonModalInitial(draft)
    setLessonModalMode("create")
    setEditingLessonId(null)
    setLessonModalOpen(true)
  }

  const openEditModal = (lesson: DefaultWeekLesson) => {
    setLessonModalInitial({
      day_of_week: lesson.day_of_week,
      start_time: lesson.start_time,
      end_time: lesson.end_time,
      student_user_id: lesson.student_user_id,
      language: lesson.language,
      teacher: lesson.teacher,
      color: lesson.color,
      details_background_color: lesson.details_background_color,
      slot_color: lesson.slot_color,
      online: lesson.online,
    })
    setLessonModalMode("edit")
    setEditingLessonId(lesson.id)
    setLessonModalOpen(true)
  }

  const handleSaveLesson = async (draft: DefaultWeekLessonDraft) => {
    if (!draft.student_user_id) {
      setError("Първо избери ученик.")
      return
    }
    setSavingLesson(true)
    setStatus(null)
    setError(null)
    if (lessonModalMode === "create") {
      const res = await fetch("/api/default-week/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? "Неуспешно добавяне на урок.")
        setSavingLesson(false)
        return
      }
      const lesson = await res.json()
      setLessons((prev) => [...prev, lesson].sort((a, b) => a.day_of_week - b.day_of_week || a.start_time.localeCompare(b.start_time)))
      setStatus("Урокът е добавен.")
    } else if (editingLessonId !== null) {
      const res = await fetch(`/api/default-week/lessons/${editingLessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? "Неуспешно запазване на урока.")
        setSavingLesson(false)
        return
      }
      const updated = await res.json()
      setLessons((prev) => prev.map((lesson) => (lesson.id === editingLessonId ? updated : lesson)))
      setStatus("Урокът е запазен.")
    }
    setSavingLesson(false)
    setLessonModalOpen(false)
    setEditingLessonId(null)
  }

  const handleDeleteLesson = async () => {
    if (editingLessonId === null) return
    setStatus(null)
    setError(null)
    const res = await fetch(`/api/default-week/lessons/${editingLessonId}`, { method: "DELETE" })
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? "Неуспешно изтриване на урока.")
      return
    }
    setLessons((prev) => prev.filter((lesson) => lesson.id !== editingLessonId))
    setLessonModalOpen(false)
    setEditingLessonId(null)
    setStatus("Урокът е изтрит.")
  }

  const referenceWeekStart = useMemo(() => {
    const timeZone = settings?.timezone ?? "UTC"
    const mondayStr = getNextWeekMonday(timeZone)
    // Use noon local time to avoid timezone issues, then set to midnight
    const date = new Date(`${mondayStr}T12:00:00`)
    date.setHours(0, 0, 0, 0)
    return date
  }, [settings?.timezone])

  const gridClasses = useMemo(() => {
    const timeZone = settings?.timezone ?? "UTC"
    const weekStart = getNextWeekMonday(timeZone)
    return lessons.map((lesson) => ({
      id: lesson.id,
      title: studentLookup.get(lesson.student_user_id) ?? "Урок",
      student_user_id: lesson.student_user_id,
      language: lesson.language,
      teacher: lesson.teacher,
      color: lesson.color,
      details_background_color: lesson.details_background_color,
      slot_color: lesson.slot_color,
      online: lesson.online,
      date: addDays(weekStart, lesson.day_of_week - 1),
      start_time: lesson.start_time,
      end_time: lesson.end_time,
      lesson_notes: "",
      homework: "",
      created_at: "",
      updated_at: "",
    })) as ClassRow[]
  }, [lessons, studentLookup])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Зареждане...</div>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h1 className="text-xl font-semibold text-foreground">Необходим е администраторски достъп</h1>
            <p className="mt-2 text-sm text-muted-foreground">Само администратори могат да редактират седмицата по подразбиране.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Седмичен график по подразбиране</h1>
            <p className="mt-2 text-sm text-muted-foreground">Задай седмичния шаблон, от който автоматично се създават следващите седмици.</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Обратно към календара
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {status && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {status}
          </div>
        )}

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-foreground">Настройки</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3 md:items-end">
            <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
              Часова зона
              <input
                value={settings?.timezone ?? ""}
                onChange={(e) => setSettings((prev) => (prev ? { ...prev, timezone: e.target.value } : prev))}
                placeholder="Europe/Sofia"
                className="h-11 rounded-xl border border-border bg-background px-4 text-sm"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
              Прилагай седмицата по подразбиране до
              <span className="flex gap-2">
                <input
                  type="date"
                  value={settings?.active_until ?? ""}
                  min={getNextWeekMonday(settings?.timezone ?? "UTC")}
                  onChange={(e) =>
                    setSettings((prev) => (prev ? { ...prev, active_until: e.target.value || null } : prev))
                  }
                  className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-background px-4 text-sm"
                />
                {settings?.active_until && (
                  <button
                    type="button"
                    onClick={() => setSettings((prev) => (prev ? { ...prev, active_until: null } : prev))}
                    className="rounded-xl border border-border px-3 text-sm font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Изчисти
                  </button>
                )}
              </span>
            </label>
            <label className="flex h-11 items-center gap-3 text-sm font-semibold text-foreground">
              <input
                type="checkbox"
                checked={Boolean(settings?.auto_generate)}
                onChange={(e) => setSettings((prev) => (prev ? { ...prev, auto_generate: e.target.checked } : prev))}
                className="size-4"
              />
              Автоматично генериране всяка неделя
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={savingSettings || !settings}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {savingSettings ? "Запазване..." : "Запази настройките"}
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary disabled:opacity-60"
            >
              {generating
                ? "Генериране..."
                : settings?.active_until
                  ? `Добави в календара до ${settings.active_until}`
                  : "Генерирай следващата седмица сега"}
            </button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {settings?.active_until
              ? `Автоматичното генериране спира след ${settings.active_until}. Запази настройките, за да важи датата и за неделното генериране.`
              : "Без крайна дата: седмицата по подразбиране се добавя всяка неделя, докато автоматичното генериране е включено."}
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Календар на седмицата по подразбиране</h2>
              <p className="mt-1 text-sm text-muted-foreground">Кликни на свободен час, за да добавиш урок. Кликни на урок, за да го редактираш.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setLessonModalMode("create")
                setLessonModalInitial(createLessonDraft(students))
                setEditingLessonId(null)
                setLessonModalOpen(true)
              }}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Добави урок
            </button>
          </div>
          <div className="mt-4 rounded-2xl border border-border overflow-hidden shadow-sm bg-background">
            <CalendarGrid
              language="bg"
              locale="bg-BG"
              labels={{
                time: "Час",
                previousWeek: "Предишна седмица",
                nextWeek: "Следваща седмица",
              }}
              viewerBadge="Седмица по подразбиране"
              showClassTitles={true}
              weekStart={referenceWeekStart}
              classes={gridClasses}
              onPrevWeek={() => {}}
              onNextWeek={() => {}}
              onSlotClick={(dateStr, startTime) => openCreateModal(dateStr, startTime)}
              onClassClick={(cls) => {
                const lesson = lessons.find((item) => item.id === cls.id)
                if (lesson) openEditModal(lesson)
              }}
            />
          </div>
        </section>
      </div>

      <DefaultWeekLessonModal
        open={lessonModalOpen}
        title={lessonModalMode === "create" ? "Добави урок по подразбиране" : "Редактирай урок по подразбиране"}
        students={students}
        initial={lessonModalInitial}
        submitLabel={savingLesson ? "Запазване..." : lessonModalMode === "create" ? "Добави урок" : "Запази промените"}
        onSave={handleSaveLesson}
        onDelete={lessonModalMode === "edit" ? handleDeleteLesson : undefined}
        onClose={() => {
          setLessonModalOpen(false)
          setEditingLessonId(null)
        }}
      />
    </div>
  )
}
