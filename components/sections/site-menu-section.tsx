import { useRouter } from "next/navigation";
import type { TranslationDictionary } from "@/lib/i18n";

type Props = {
    t: TranslationDictionary;
}

const MENU_ITEMS = [
    { key: "offers", href: "/offers"},
    { key: "events", href: "/events"},
    { key: "reviews", href: "/reviews"},
] as const;

export default function SiteMenuSection({ t }: Props) {
    const router = useRouter();

    return (
        <section id="menu" className="max-w-5xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {MENU_ITEMS.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => router.push(item.href)}
                        className="rounded-xl border border-gray-200 bg-white p-8 text-center font-semibold text-gray-800 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
                >
                        {item.key}
                    </button>
                ))}
            
            </div>
        </section>
    )
}