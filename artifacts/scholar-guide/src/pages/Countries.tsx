import { Link } from "wouter";
import { useMemo, useState } from "react";
import { useListCountries } from "@workspace/api-client-react";
import { useLang } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const REGION_AR: Record<string, string> = {
  Europe: "أوروبا",
  "North America": "أمريكا الشمالية",
  "South America": "أمريكا الجنوبية",
  Asia: "آسيا",
  Africa: "أفريقيا",
  Oceania: "أوقيانوسيا",
  "Middle East": "الشرق الأوسط",
};

const REGION_ICON: Record<string, string> = {
  Europe: "🏰",
  "North America": "🗽",
  "South America": "🌴",
  Asia: "🏯",
  Africa: "🦁",
  Oceania: "🏝️",
  "Middle East": "🕌",
};

function heatColor(count: number, max: number): string {
  if (count === 0) return "bg-muted/40";
  const ratio = count / max;
  if (ratio > 0.8) return "bg-gradient-to-br from-accent to-orange-400 text-white border-accent";
  if (ratio > 0.5) return "bg-primary/30 text-primary-foreground border-primary/40";
  if (ratio > 0.2) return "bg-primary/15 border-primary/20";
  return "bg-muted/60";
}

export default function Countries() {
  const { lang } = useLang();
  const countries = useListCountries();
  const [search, setSearch] = useState("");

  const grouped = useMemo(() => {
    const map = new Map<string, typeof countries.data>();
    (countries.data ?? []).forEach((c) => {
      const arr = map.get(c.region) ?? [];
      arr.push(c);
      map.set(c.region, arr);
    });
    return map;
  }, [countries.data]);

  const maxCount = useMemo(
    () => Math.max(1, ...(countries.data ?? []).map((c) => c.opportunityCount)),
    [countries.data],
  );

  const top12 = useMemo(
    () => (countries.data ?? []).slice().sort((a, b) => b.opportunityCount - a.opportunityCount).slice(0, 12),
    [countries.data],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return countries.data ?? [];
    return (countries.data ?? []).filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameAr.includes(q) ||
        c.code.toLowerCase().includes(q),
    );
  }, [countries.data, search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
        {lang === "ar" ? "اكتشف الوجهات" : "Explore Destinations"}
      </h1>
      <p className="text-muted-foreground mb-8">
        {lang === "ar"
          ? `${(countries.data ?? []).length} دولة بفرص متنوعة بانتظارك`
          : `${(countries.data ?? []).length} countries with diverse opportunities`}
      </p>

      {/* Top 12 horizontal scroll */}
      <section className="mb-10">
        <h2 className="font-bold text-xl mb-4">
          {lang === "ar" ? "🔥 الأكثر طلباً" : "🔥 Most Popular"}
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4">
          {top12.map((c) => (
            <Link key={c.code} href={`/countries/${c.code}`}>
              <Card className="shrink-0 w-32 p-4 text-center hover-elevate cursor-pointer hover:border-primary/40">
                <div className="text-5xl mb-2">{c.flag}</div>
                <div className="text-sm font-bold truncate">
                  {lang === "ar" ? c.nameAr : c.name}
                </div>
                <div className="text-xs text-primary mt-1 font-medium">
                  {c.opportunityCount} {lang === "ar" ? "فرصة" : "opps"}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Atlas grouped by region */}
      <section className="mb-12">
        <h2 className="font-bold text-xl mb-4">
          {lang === "ar" ? "🗺️ الأطلس التفاعلي" : "🗺️ Interactive Atlas"}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {lang === "ar"
            ? "كل دولة ملونة حسب عدد الفرص المتاحة. الألوان الأكثر دفئاً تعني فرصاً أكثر."
            : "Each tile is heat-colored by opportunity count. Warmer = more opportunities."}
        </p>

        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([region, list]) => (
            <div key={region}>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-2xl">{REGION_ICON[region] ?? "🌍"}</span>
                {lang === "ar" ? REGION_AR[region] ?? region : region}
                <span className="text-sm font-normal text-muted-foreground">({(list ?? []).length})</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {(list ?? [])
                  .slice()
                  .sort((a, b) => b.opportunityCount - a.opportunityCount)
                  .map((c) => (
                    <Link key={c.code} href={`/countries/${c.code}`}>
                      <div
                        className={`p-3 rounded-xl border cursor-pointer hover-elevate transition-all ${heatColor(c.opportunityCount, maxCount)}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{c.flag}</span>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold truncate">
                              {lang === "ar" ? c.nameAr : c.name}
                            </div>
                            <div className="text-xs opacity-90">
                              {c.opportunityCount} {lang === "ar" ? "فرصة" : "opps"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flag grid - user explicit request */}
      <section className="border-t pt-10">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
          <div>
            <h2 className="font-bold text-xl flex items-center gap-2">
              {lang === "ar" ? "🇺🇳 أعلام الدول" : "🇺🇳 Country Flags"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {lang === "ar"
                ? "اضغط على علم لاستكشاف منح وفرص ذلك البلد"
                : "Click any flag to explore that country's opportunities"}
            </p>
          </div>
          <div className="relative w-64">
            <Search className="absolute top-1/2 -translate-y-1/2 ms-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "ar" ? "ابحث عن دولة" : "Search countries"}
              className="ps-10"
            />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
          {filtered.map((c) => (
            <Link key={c.code} href={`/countries/${c.code}`}>
              <div
                className="aspect-square h-16 w-16 mx-auto rounded-full bg-card border-2 border-border hover:border-primary hover:scale-110 transition-all cursor-pointer flex flex-col items-center justify-center hover:shadow-lg"
                title={lang === "ar" ? c.nameAr : c.name}
              >
                <span className="text-2xl leading-none">{c.flag}</span>
                <span className="text-[9px] font-bold text-muted-foreground mt-0.5">{c.code}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
