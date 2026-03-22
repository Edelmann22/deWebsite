"use client"

import { useEffect, useState } from "react"
import type { Language } from "@/lib/i18n"

const STORAGE_KEY = "ui-language"
const DEFAULT_LANGUAGE: Language = "en"

const isLanguage = (value: string | null): value is Language => value === "en" || value === "de" || value === "bg"

const readStoredLanguage = () => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return isLanguage(saved) ? saved : DEFAULT_LANGUAGE
}

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(() => readStoredLanguage())

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  useEffect(() => {
    if (typeof window === "undefined") return
    const handler = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return
      if (isLanguage(event.newValue)) {
        setLanguageState(event.newValue)
      }
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  const setLanguage = (value: Language) => {
    setLanguageState(value)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value)
    }
  }

  return { language, setLanguage }
}
