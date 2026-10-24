// Fonts and colour tokens for the "paper" pages. Kept out of paper.tsx
// (a client module) so server components can use them too.

import { Lora, Caveat } from "next/font/google"

export const serif = Lora({ subsets: ["latin", "cyrillic"], display: "swap" })
export const hand = Caveat({ subsets: ["latin", "cyrillic"], weight: ["500", "700"], display: "swap" })

export const BRAND_RED = "text-[#D10026]"
export const PAPER_BG = "bg-[#FBF7F0]"
export const PRINT_SHADOW = "shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]"
