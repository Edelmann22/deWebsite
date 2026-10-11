export const DEFAULT_CLASS_COLOR = "#009bb3"
export const DEFAULT_CLASS_DETAILS_BACKGROUND_COLOR = "#e7f6f8"
export const DEFAULT_CLASS_SLOT_COLOR = "#cfecee"

export const CLASS_COLOR_OPTIONS = [
  { value: "#2f8f9d", label: "Тюркоаз" },
  { value: "#4f7cff", label: "Синьо" },
  { value: "#7c5cff", label: "Индиго" },
  { value: "#df6d3c", label: "Теракота" },
  { value: "#d18a00", label: "Кехлибар" },
  { value: "#3f9f5d", label: "Зелено" },
  { value: "#d04f7d", label: "Розово" },
  { value: "#6f7a86", label: "Сиво" },
] as const

export const CLASS_DETAILS_BACKGROUND_COLOR_OPTIONS = [
  { value: "#e7f6f8", label: "Мъгла" },
  { value: "#e9efff", label: "Небе" },
  { value: "#efe9ff", label: "Люляк" },
  { value: "#fce9df", label: "Праскова" },
  { value: "#fff3da", label: "Масло" },
  { value: "#e8f5e9", label: "Градински чай" },
  { value: "#fde8f0", label: "Руж" },
  { value: "#eef1f4", label: "Облак" },
] as const

export const CLASS_SLOT_COLOR_OPTIONS = [
  { value: "#cfecee", label: "Светъл тюркоаз" },
  { value: "#d9e5ff", label: "Светлосиньо" },
  { value: "#e6ddff", label: "Светло индиго" },
  { value: "#ffdcca", label: "Светла праскова" },
  { value: "#ffeab8", label: "Светъл кехлибар" },
  { value: "#d8efd9", label: "Светлозелено" },
  { value: "#ffdbe8", label: "Светлорозово" },
  { value: "#e2e7ec", label: "Светлосиво" },
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
