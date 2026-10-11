"use client"

import { useState } from "react"
import { KeyRound, X } from "lucide-react"
import type { TranslationDictionary } from "@/lib/i18n"

type Props = {
  t: TranslationDictionary
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>
  onClose: () => void
}

const MIN_PASSWORD_LENGTH = 6

export default function ChangePasswordModal({ t, onSubmit, onClose }: Props) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (newPassword.length < MIN_PASSWORD_LENGTH) return setError(t.passwordTooShort)
    if (newPassword !== confirmPassword) return setError(t.authMismatch)
    if (newPassword === currentPassword) return setError(t.passwordSameAsOld)

    setSaving(true)
    try {
      await onSubmit(currentPassword, newPassword)
      setDone(true)
    } catch (err) {
      const code = (err as { code?: string })?.code
      setError(
        code === "wrong_current"
          ? t.passwordWrongCurrent
          : code === "too_short"
            ? t.passwordTooShort
            : code === "same_password"
              ? t.passwordSameAsOld
              : t.genericError
      )
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "h-11 w-full rounded-md border border-input bg-background px-3 text-[15px] text-foreground shadow-none"

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="change-password-title" className="flex items-center gap-2 text-base font-semibold text-foreground">
            <KeyRound size={16} className="text-primary" />
            {t.changePassword}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col gap-4 px-5 py-5">
            <p role="status" className="border-l-2 border-emerald-500 pl-3 text-sm text-foreground">
              {t.passwordChanged}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-md bg-foreground px-4 text-sm font-semibold text-background hover:bg-foreground/85"
            >
              {t.close}
            </button>
          </div>
        ) : (
          <form className="flex flex-col gap-4 px-5 py-5" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">{t.currentPassword}</span>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">{t.newPassword}</span>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={MIN_PASSWORD_LENGTH}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">{t.confirmNewPassword}</span>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={MIN_PASSWORD_LENGTH}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
              />
            </label>

            {error && (
              <p role="alert" className="border-l-2 border-destructive pl-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="mt-1 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-md border border-border px-4 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="h-11 rounded-md bg-foreground px-4 text-sm font-semibold text-background hover:bg-foreground/85 disabled:opacity-50"
              >
                {saving ? t.saving : t.changePassword}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
