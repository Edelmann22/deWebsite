"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Plus, Loader2, CalendarDays } from "lucide-react"
import CalendarGrid from "@/components/calendar-grid"
import ClassDetailPanel from "@/components/class-detail-panel"
import RawCreateClassModal from "@/components/create-class-modal"
import UpcomingClasses from "@/components/upcoming-classes"
import EventList from "@/components/event-list"
import LandingPage from "@/components/landing-page"
import { useClasses } from "@/hooks/use-classes"
import { useSession } from "@/hooks/use-session"
import { useStudents } from "@/hooks/use-students"
import { useEvents } from "@/hooks/use-events"
import type { ClassRow } from "@/lib/db"
import { LANGUAGE_META, type Language, translations } from "@/lib/i18n"

const CreateClassModal: any = RawCreateClassModal
const PAGE_BACKGROUND_IMAGE = ""

export default function HomePage() {
  const now = new Date()
  const [language, setLanguage] = useState<Language>("en")
  const [guestMode, setGuestMode] = useState(false)
  const [currentDate, setCurrentDate] = useState(now)
  const [selectedClass, setSelectedClass] = useState<ClassRow | null>(null)
  const [createDate, setCreateDate] = useState<string | null>(null)
  const [createTime, setCreateTime] = useState<string | null>(null)
  const router = useRouter()
  const { user, loading: sessionLoading, logout } = useSession()
  const t = translations[language]
  const locale = LANGUAGE_META[language].locale
  const isAdmin = user?.role === "admin"
  const isStudent = user?.role === "student"
  const isGuest = !user && guestMode
  const { students } = useStudents(isAdmin)
  const { events, loading: eventsLoading, deleteEvent } = useEvents(!sessionLoading)

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("ui-language")
    if (savedLanguage === "en" || savedLanguage === "de" || savedLanguage === "bg") {
      setLanguage(savedLanguage)
    }
    setGuestMode(window.localStorage.getItem("guest-mode") === "true")
  }, [])

  useEffect(() => {
    window.localStorage.setItem("ui-language", language)
  }, [language])

  useEffect(() => {
    window.localStorage.setItem("guest-mode", guestMode ? "true" : "false")
  }, [guestMode])

  const formatDateParam = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

  const year = currentDate.getFullYear()
  // Use 1-based month so it matches the API (1 = January, 12 = December)
  const month = currentDate.getMonth() + 1

  const weekStart = new Date(currentDate)
  weekStart.setHours(0, 0, 0, 0)
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7))

  // Load a rolling window of classes around the visible week
  const rangeStart = new Date(weekStart)
  rangeStart.setDate(rangeStart.getDate() - 7) // one week before
  const rangeEnd = new Date(weekStart)
  rangeEnd.setDate(rangeEnd.getDate() + 7 * 5) // about five weeks ahead

  const { classes, loading, createClass, updateClass, deleteClass } = useClasses(
    formatDateParam(rangeStart),
    formatDateParam(rangeEnd),
    !sessionLoading && (Boolean(user) || guestMode),
  )
  const studentClasses = user?.role === "student" ? classes.filter((cls) => cls.student_user_id === user.id) : classes

  const handlePrevWeek = () => {
    setCurrentDate(prev => {
      const d = new Date(prev)
      d.setDate(d.getDate() - 7)
      return d
    })
  }

  const handleNextWeek = () => {
    setCurrentDate(prev => {
      const d = new Date(prev)
      d.setDate(d.getDate() + 7)
      return d
    })
  }

  if (!sessionLoading && !user && !isGuest) {
    return (
      <LandingPage
        language={language}
        onLanguageChange={(value) => setLanguage(value)}
        t={t}
        locale={locale}
        events={events}
        eventsLoading={eventsLoading}
        onGetStarted={() => router.push("/auth")}
        onLogin={() => router.push("/auth")}
      />
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-sans">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={
          PAGE_BACKGROUND_IMAGE
            ? {
                backgroundImage: `url(${PAGE_BACKGROUND_IMAGE})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }
            : undefined
        }
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(91,175,189,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(234,179,90,0.1),transparent_30%)]" />
      <div className="relative z-10">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <GraduationCap size={16} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">{t.appName}</span>
          </div>

          <div className="flex items-center gap-2">
            <a href="#" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-primary bg-brand-light">
              <CalendarDays size={14} />
              <span className="hidden sm:inline">{t.weekView}</span>
            </a>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground"
              aria-label="Website language"
            >
              {Object.entries(LANGUAGE_META).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
            {(user || isGuest) && (
              <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm">
                <span className="font-semibold text-foreground">{t.viewAs}:</span>
                <span className="text-foreground">{user?.nickname ?? t.guestBadge}</span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                  {isAdmin ? t.adminBadge : isGuest ? t.guestBadge : t.studentBadge}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <button
                type="button"
                onClick={() => {
                  setGuestMode(false)
                  logout()
                }}
                className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                {t.logout}
              </button>
            )}
            {isGuest && (
              <button
                type="button"
                onClick={() => setGuestMode(false)}
                className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                {t.logout}
              </button>
            )}
          {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push("/events/new")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm font-semibold hover:bg-secondary transition"
                >
                  <CalendarDays size={15} />
                  <span className="hidden sm:inline">{t.newEvent}</span>
                </button>
                <button
                  onClick={() => {
                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(
                      currentDate.getDate(),
                    ).padStart(2, "0")}`
                    setCreateDate(dateStr)
                    setCreateTime(null)
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition shadow-sm"
                >
                  <Plus size={15} />
                  <span className="hidden sm:inline">{t.newClass}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 ${isAdmin || isStudent ? "lg:flex-row" : ""}`}>
        {sessionLoading ? (
          <section className="flex w-full justify-center py-16">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
          </section>
        ) : (
          <>

        {/* Calendar section */}
        <section className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">{t.classSchedule}</h1>
            {loading && <Loader2 size={18} className="animate-spin text-muted-foreground" />}
          </div>

          {(user || isGuest) && (
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/85 px-4 py-3 text-sm">
              <span className="font-semibold text-foreground">{t.viewAs}:</span>
              <span className="text-foreground">{user?.nickname ?? t.guestBadge}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                {isAdmin ? t.adminBadge : isGuest ? t.guestBadge : t.studentBadge}
              </span>
              <span className="text-muted-foreground">
                {isAdmin ? t.adminFullAccess : isGuest ? t.guestCalendarOnly : t.studentCalendarOnly}
              </span>
            </div>
          )}

          <div className="rounded-2xl border border-border overflow-hidden shadow-sm bg-card">
            <CalendarGrid
              language={language}
              locale={locale}
              labels={{
                time: t.time,
                previousWeek: t.previousWeek,
                nextWeek: t.nextWeek,
              }}
              viewerBadge={user?.nickname ?? (isGuest ? t.guestBadge : undefined)}
              showClassTitles={!isGuest}
              weekStart={weekStart}
              classes={classes}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              onSlotClick={(date, time) => {
                if (!isAdmin) return
                setCreateDate(date)
                setCreateTime(time)
              }}
              onClassClick={(cls) => {
                if (isGuest) return
                setSelectedClass(cls)
              }}
            />
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-primary inline-block" />
              {t.scheduledClass}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-brand-light inline-block border border-primary/30" />
              {t.today}
            </span>
            {isAdmin && (
            <span className="hidden sm:flex items-center gap-1">
              {t.addClassHint} <span className="mx-1 inline-flex items-center justify-center w-4 h-4 bg-muted rounded text-foreground"><Plus size={10} /></span> {t.addClassHintEnd}
            </span>
            )}
          </div>
        </section>

        {/* Sidebar */}
        {(isAdmin || isStudent) && (
        <aside className={`w-full shrink-0 flex flex-col gap-6 ${isAdmin || isStudent ? "lg:w-72 xl:w-80" : ""}`}>
          {/* Stats */}
          {isAdmin && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.thisMonth}</span>
                <span className="text-3xl font-bold text-foreground">
                  {classes.filter(
                    (c) =>
                      new Date(c.date).getFullYear() === year &&
                      new Date(c.date).getMonth() + 1 === month,
                  ).length}
                </span>
                <span className="text-xs text-muted-foreground">{t.classesScheduled}</span>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.withHomework}</span>
                <span className="text-3xl font-bold text-foreground">
                  {classes.filter(
                    (c) =>
                      new Date(c.date).getFullYear() === year &&
                      new Date(c.date).getMonth() + 1 === month &&
                      c.homework.trim(),
                  ).length}
                </span>
                <span className="text-xs text-muted-foreground">{t.assignmentsSet}</span>
              </div>
            </div>
          )}

          {/* Upcoming */}
          <UpcomingClasses
            classes={studentClasses}
            onClassClick={(cls) => setSelectedClass(cls)}
            title={isAdmin ? t.upcoming : t.myClasses}
            locale={locale}
          />

          <EventList
            events={events}
            loading={eventsLoading}
            locale={locale}
            isAdmin={isAdmin}
            onDelete={async (id) => {
              const ok = window.confirm(t.deleteEventConfirm)
              if (!ok) return
              await deleteEvent(id)
            }}
            labels={{
              title: t.eventsTitle,
              subtitle: t.eventsSubtitle,
              empty: t.eventsEmpty,
              loading: t.eventsLoading,
              edit: t.editEvent,
              remove: t.deleteEvent,
            }}
          />

          {/* Empty state */}
          {!loading && studentClasses.length === 0 && (
            <div className="bg-card border border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-3 text-center">
              <CalendarDays size={28} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isAdmin ? (
                  <>{t.noClassesThisMonth}<br />{t.clickNewClass} <strong>{t.newClass}</strong> {t.orTapDay}</>
                ) : (
                  t.noClassesThisMonth
                )}
              </p>
            </div>
          )}
        </aside>
        )}
          </>
        )}
      </main>

      {/* Modals */}
      {selectedClass && (
        <ClassDetailPanel
          cls={selectedClass}
          locale={locale}
          t={t}
          students={students}
          canEdit={isAdmin}
          onClose={() => setSelectedClass(null)}
          onUpdate={async (id, payload) => {
            const updated = await updateClass(id, payload)
            setSelectedClass(updated)
            return updated
          }}
          onDelete={async (id) => {
            await deleteClass(id)
            setSelectedClass(null)
          }}
        />
      )}

      {isAdmin && createDate && (
        <CreateClassModal
          key={`${createDate}-${createTime ?? "default"}`}
          date={createDate}
          language={language}
          t={t}
          students={students}
          initialStartTime={createTime ?? undefined}
          onCreate={createClass}
          onClose={() => {
            setCreateDate(null)
            setCreateTime(null)
          }}
        />
      )}

      <footer className="border-t border-border bg-card/85 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-10">
            <div>
              <p className="font-semibold text-foreground">Contacts</p>
              <p>Phone: <a className="text-primary hover:underline" href="tel:+359888559913">+359 888 559 913</a></p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Location</p>
              <a
                className="text-primary hover:underline"
                href="https://maps.app.goo.gl/Ghicy5quB8bFGZe48"
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}
