"use client"

import { useEffect, useState } from "react"
import { LANGUAGES, type Language } from "@/lib/i18n"

const STORAGE_KEY = "ui-language"
const DEFAULT_LANGUAGE: Language = "bg"

const isLanguage = (value: string | null): value is Language => LANGUAGES.includes(value as Language)

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
      document.cookie = `ui-language=${value}; path=/; max-age=${60 * 60 * 24 * 365}`
    }
  }

  return { language, setLanguage }
}
