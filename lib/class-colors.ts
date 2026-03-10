export const DEFAULT_CLASS_COLOR = "#009bb3"
export const DEFAULT_CLASS_DETAILS_BACKGROUND_COLOR = "#e7f6f8"
export const DEFAULT_CLASS_SLOT_COLOR = "#cfecee"

export const CLASS_COLOR_OPTIONS = [
  { value: "#2f8f9d", label: "Teal" },
  { value: "#4f7cff", label: "Blue" },
  { value: "#7c5cff", label: "Indigo" },
  { value: "#df6d3c", label: "Terracotta" },
  { value: "#d18a00", label: "Amber" },
  { value: "#3f9f5d", label: "Green" },
  { value: "#d04f7d", label: "Rose" },
  { value: "#6f7a86", label: "Slate" },
] as const

export const CLASS_DETAILS_BACKGROUND_COLOR_OPTIONS = [
  { value: "#e7f6f8", label: "Mist" },
  { value: "#e9efff", label: "Sky" },
  { value: "#efe9ff", label: "Lilac" },
  { value: "#fce9df", label: "Peach" },
  { value: "#fff3da", label: "Butter" },
  { value: "#e8f5e9", label: "Sage" },
  { value: "#fde8f0", label: "Blush" },
  { value: "#eef1f4", label: "Cloud" },
] as const

export const CLASS_SLOT_COLOR_OPTIONS = [
  { value: "#cfecee", label: "Soft Teal" },
  { value: "#d9e5ff", label: "Soft Blue" },
  { value: "#e6ddff", label: "Soft Indigo" },
  { value: "#ffdcca", label: "Soft Peach" },
  { value: "#ffeab8", label: "Soft Amber" },
  { value: "#d8efd9", label: "Soft Green" },
  { value: "#ffdbe8", label: "Soft Rose" },
  { value: "#e2e7ec", label: "Soft Slate" },
] as const

export function normalizeClassColor(color?: string | null) {
  if (!color) return DEFAULT_CLASS_COLOR
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : DEFAULT_CLASS_COLOR
}

export function normalizeClassDetailsBackgroundColor(color?: string | null) {
  if (!color) return DEFAULT_CLASS_DETAILS_BACKGROUND_COLOR
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : DEFAULT_CLASS_DETAILS_BACKGROUND_COLOR
}

export function normalizeClassSlotColor(color?: string | null) {
  if (!color) return DEFAULT_CLASS_SLOT_COLOR
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : DEFAULT_CLASS_SLOT_COLOR
}
